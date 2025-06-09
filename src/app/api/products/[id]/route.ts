import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export const GET = async (
  request: NextRequest,
  { params }: Props
) => {
  const id = params.id;
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
