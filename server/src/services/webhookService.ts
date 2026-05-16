import Razorpay from "razorpay";
import prisma from "../config/prismaClient.js";

/**
 * Handle Razorpay Webhooks
 */
export const handleRazorpayWebhookService = async (
    rawBody: Buffer | string,
    signature: string
) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not defined in .env");
        throw new Error("Webhook secret not configured.");
    }

    // 1. Verify signature
    // The raw body must exactly match what Razorpay sent, otherwise HMAC fails.
    const isValid = Razorpay.validateWebhookSignature(
        rawBody.toString(),
        signature,
        webhookSecret
    );

    if (!isValid) {
        throw new Error("Invalid Razorpay webhook signature");
    }

    // 2. Parse the verified body
    const event = JSON.parse(rawBody.toString());

    // 3. Handle specific events
    switch (event.event) {
        case "payment.captured": {
            const payment = event.payload.payment.entity;
            const razorpayOrderId = payment.order_id;
            const razorpayPaymentId = payment.id;

            // Find order
            const order = await prisma.order.findFirst({
                where: { razorpayOrderId },
            });

            if (!order) {
                console.warn(`Order not found for razorpay_order_id: ${razorpayOrderId}`);
                break;
            }

            // Skip if already PAID (idempotency)
            if (order.paymentStatus === "PAID") {
                break;
            }

            // Update order
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "PAID",
                    razorpayPaymentId: razorpayPaymentId,
                    status: "PROCESSING", 
                },
            });
            
            console.log(`Webhook: Order ${order.id} marked as PAID`);
            break;
        }

        case "payment.failed": {
            const payment = event.payload.payment.entity;
            const razorpayOrderId = payment.order_id;

            const order = await prisma.order.findFirst({
                where: { razorpayOrderId },
            });

            if (!order) break;

            if (order.paymentStatus !== "PAID") {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: "FAILED",
                    },
                });
                console.log(`Webhook: Order ${order.id} marked as FAILED`);
            }
            break;
        }

        default:
            console.log(`Unhandled webhook event: ${event.event}`);
    }
};
