import { z } from "zod";

export const placeOrderSchema = z.object({
    body: z.object({
        shippingAddress: z.string().min(5, "Shipping address must be at least 5 characters"),
        paymentMethod: z.enum(["COD", "CARD"])
    })
});