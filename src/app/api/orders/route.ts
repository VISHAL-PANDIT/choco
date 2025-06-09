import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db/db";
import {
  deliveryPersons,
  inventories,
  orders,
  products,
  warehouses,
} from "@/lib/db/schema";
import { orderSchema } from "@/lib/validators/orderSchema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  //get session
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Not allowed" }, { status: 401 });
  }
  console.log(session);

  //validate request body
  const requestData = await request.json();
  let validatedData;
  try {
    validatedData = await orderSchema.parse(requestData);
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }

  console.log("Validated data", validatedData);

  //Order Creation
  const warehouseResult = await db
    .select({ id: warehouses.id })
    .from(warehouses)
    .where(eq(warehouses.pincode, validatedData.pincode));

  if (!warehouseResult.length) {
    return Response.json({ message: "No Warehouse found" }, { status: 404 });
  }

  const foundProduct = await db
    .select()
    .from(products)
    .where(eq(products.id, validatedData.productId))
    .limit(1);

  if (!foundProduct.length) {
    return Response.json({ message: "No Product found" }, { status: 404 });
  }

  let transactionError: string = "";
  let finalOrder: { id: number; price: number } | null = null;
  try {
    finalOrder = await db.transaction(async (tx) => {
      //create order
      const order = await tx
        .insert(orders)
        .values({
          ...validatedData,
          //@ts-expect-error - session.token.id exists but TypeScript doesn't know about it
          userId: session.token.id,
          price: foundProduct[0].price * validatedData.qty,
          status: "received",
        })
        .returning({ id: orders.id, price: orders.price });

      //check stock
      const availableStock = await tx
        .select()
        .from(inventories)
        .where(
          and(
            eq(inventories.warehouseId, warehouseResult[0].id),
            eq(inventories.productId, validatedData.productId),
            isNull(inventories.orderId)
          )
        )
        .limit(validatedData.qty)
        .for("update", { skipLocked: true });

      if (availableStock.length < validatedData.qty) {
        transactionError = `Stock is low, only ${availableStock.length} products available`;
        tx.rollback();
        return null;
      }

      //check delivery person availibility
      const availablePersons = await tx
        .select()
        .from(deliveryPersons)
        .where(
          and(
            isNull(deliveryPersons.orderId),
            eq(deliveryPersons.warehouseId, warehouseResult[0].id)
          )
        )
        .for("update")
        .limit(1);

      if (!availablePersons.length) {
        transactionError = `Delivery person is not available at the moment`;
        tx.rollback();
        return null;
      }

      //stock is available and delivery person is available
      //update inventories and add order id

      await tx
        .update(inventories)
        .set({ orderId: order[0].id })
        .where(
          inArray(
            inventories.id,
            availableStock.map((stock) => stock.id)
          )
        );

      //update delivery persons
      await tx
        .update(deliveryPersons)
        .set({ orderId: order[0].id })
        .where(eq(deliveryPersons.id, availablePersons[0].id));

      //update order
      await tx
        .update(orders)
        .set({ status: "reserved" })
        .where(eq(orders.id, order[0].id));
      return order[0];
    });

    if (!finalOrder) {
      return Response.json({ message: transactionError }, { status: 400 });
    }

    return Response.json({ order: finalOrder }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        message: transactionError ? transactionError : "Error while db transaction",
      },
      { status: 500 }
    );
  }
}
