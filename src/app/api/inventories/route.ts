import { db } from "@/lib/db/db";
import { inventories } from "@/lib/db/schema";
import { inventorySchema } from "@/lib/validators/inventorySchema";

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
