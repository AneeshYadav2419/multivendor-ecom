import { z } from "zod";

export const createPaymentOrderSchema = z.object({
    body: z.object({
        amount: z.number(),
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
        orderId: z.string().min(1),
    }),
});