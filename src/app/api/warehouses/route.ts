import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/schema";
import { warehouseSchema } from "@/lib/validators/warehouseSchema";

export async function POST(request: Request) {
  //todo :check auth
  const requestData = await request.json();

  let validatedData;
  try {
    validatedData = await warehouseSchema.parse(requestData);
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }

  try {
    await db.insert(warehouses).values(validatedData);
    return Response.json({ message: "OK" }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Failed to store warehouse", error: error },
      { status: 500 }
    );
  }
}
