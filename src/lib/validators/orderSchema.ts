import { z } from "zod";

export const orderSchema = z.object({
    productId : z.number({message: "product id should be a number"}),
    pincode: z.string({message: "Pincode should be a string"}).length(6, "Pincode should be 6 character long"),
    qty: z.number({message:"Qty should be a number"}),
    address: z.string({message: "Address should be a string"}).min(5,{message:"Address should be atleast 5 chars long"})
});