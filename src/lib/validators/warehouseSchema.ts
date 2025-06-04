import { z } from "zod";

export const warehouseSchema = z.object({
    name: z.string({message: "Warehouse name should be string"})
        .min(1, "Warehouse name is required")
        .max(100, "Warehouse name must be less than 100 characters"),
    pincode: z.string({message: "Pincode should be a string"})
        .min(6, "Pincode must be 6 characters")
        .max(6, "Pincode must be 6 characters")
        .regex(/^\d{6}$/, "Pincode must contain only numbers")
});