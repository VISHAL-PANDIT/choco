import { z } from "zod";

export const deliveryPersonSchema = z.object({
    name: z.string({message: "Warehouse name should be string"}),
    phone: z.string({message: "phone should be a string also"}).length(13, "Delivery person phone should be 13 chars long"),
    warehouseId: z.number({message: "Warehouse id should be number"})
    
});