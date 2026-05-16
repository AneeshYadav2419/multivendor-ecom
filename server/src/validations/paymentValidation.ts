import { z } from "zod";

/**
 * Create Razorpay Order Validation
 */
export const createPaymentOrderSchema = z.object({
    body: z.object({
        orderId: z
            .string()
            .cuid("Invalid order ID"),
    }),
});

/**
 * Verify Payment Validation
 */
export const verifyPaymentSchema = z.object({
    body: z.object({
        razorpay_order_id: z.string().min(1),
        razorpay_payment_id: z.string().min(1),
        razorpay_signature: z.string().min(1),
        orderId: z.string().cuid(),
    }),
});