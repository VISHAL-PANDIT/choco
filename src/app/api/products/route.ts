import { db } from "@/lib/db/db";
import { porducts } from "@/lib/db/schema";
import { productSchema } from "@/lib/validators/productSchema";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";

export async function POST(request: Request) {
  const data = await request.formData();

  let validatedData;
  try {
    validatedData = productSchema.parse({
      name: data.get("name"),
      description: data.get("description") || data.get("description") || undefined,
      price: Number(data.get("price")),
      image: data.get("image"),
    });
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }

  const filename = `${Date.now()}.${validatedData.image.name //chocoFill.png -> split(.) -> (1)choco (2)png
    .split(".")
    .slice(-1)}`;

  try {
    // Create the assets directory if it doesn't exist
    const assetsDir = path.join(process.cwd(), "public/assets");
    await mkdir(assetsDir, { recursive: true });

    const buffer = Buffer.from(await validatedData.image.arrayBuffer());
    await writeFile(
      path.join(assetsDir, filename),
      buffer
    );
  } catch (err) {
    return Response.json(
      { message: "Failed to save the file to fs", error: err },
      { status: 500 }
    );
  }
  try {
    await db.insert(porducts).values({ ...validatedData, image: filename });
  } catch (error) {
    // remove stored image from fs
    fs.unlink(filename, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
      } else {
        console.log("Image deleted successfully.");
      }
    });

    return Response.json(
      { message: "Failed to store product in data base", error: error },
      { status: 500 }
    );
  }

  return Response.json({ message: "OK" }, { status: 201 });
}
