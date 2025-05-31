import { db } from "@/lib/db/db";
import { inventories, products, warehouses } from "@/lib/db/schema";
import { inventorySchema } from "@/lib/validators/inventorySchema";
import { desc, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const requestData = await request.json();

  let validatedData;
  try {
    validatedData = await inventorySchema.parse(requestData);
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }
  try {
    await db.insert(inventories).values(validatedData);
    return Response.json({ message: "OK" }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to store the inventory into the database",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allInventories = await db
      .select({
        id: inventories.id,
        sku: inventories.sku,
        warehouseId: warehouses.name,
        product: products.name,
      })
      .from(inventories)
      .orderBy(desc(inventories.id))
      .leftJoin(warehouses, eq(inventories.warehouseId, warehouses.id))
      .leftJoin(products, eq(inventories.productId, products.id));
    return Response.json({ allInventories });
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch inventory item", error: error },
      {
        status: 500,
      }
    );
  }
}
