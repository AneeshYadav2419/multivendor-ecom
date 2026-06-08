import { z } from "zod";

// export const placeOrderSchema = z.object({
//     body: z.object({
//         shippingAddress: z.string().min(5, "Shipping address must be at least 5 characters"),
//         paymentMethod: z.enum(["COD", "CARD"])
//     })
// });

export const placeOrderSchema = z.object({
    body: z.object({
        shippingName: z.string().min(2),

        shippingPhone: z.string().min(10),

        addressLine1: z.string().min(5),

        addressLine2: z.string().optional(),

        city: z.string(),

        state: z.string(),

        country: z.string(),

        pincode: z.string(),

        paymentMethod: z.enum(["COD", "CARD", "UPI"]),
    }),
});