import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  const id = context.params.id;
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);
    if (!product.length) {
      return NextResponse.json({ message: "Product not found" }, { status: 400 });
    }

    return NextResponse.json(product[0])
  } catch (error) {
    return NextResponse.json(
      { message: "Product not found", error: error },
      { status: 400 }
    );
  }
}
