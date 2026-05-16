import crypto from "crypto";
import prisma from "../config/prismaClient.js";
import razorpay from "../config/razorpay.js";
import { AppError } from "../middlewares/errorMiddleware.js";

/**
 * CREATE PAYMENT ORDER SERVICE
 */
export const createPaymentOrderService = async (
    orderId: string,
    userId: string
) => {

    // 1. Find order
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            customerId: userId,
        },
    });

    // 2. Check order exists
    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        );
    }

    // 3. Prevent duplicate payment
    if (order.paymentStatus === "PAID") {
        throw new AppError(
            "Order already paid.",
            400,
            "ORDER_ALREADY_PAID"
        );
    }

    // 4. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: Number(order.totalAmount) * 100, // paise
        currency: "INR",
        receipt: order.id,
    });

    // 5. Save razorpayOrderId
    await prisma.order.update({
        where: {
            id: order.id,
        },

        data: {
            razorpayOrderId: razorpayOrder.id,
        },
    });

    // 6. Return payment info
    return {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
    };
};

/**
 * VERIFY PAYMENT SERVICE
 */
export const verifyPaymentService = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    orderId: string
) => {

    // 1. Generate expected signature
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(
            razorpay_order_id + "|" + razorpay_payment_id
        )
        .digest("hex");

    // 2. Compare signatures
    const isAuthentic =
        generatedSignature === razorpay_signature;

    // 3. Invalid payment
    if (!isAuthentic) {

        await prisma.order.update({
            where: { id: orderId },

            data: {
                paymentStatus: "FAILED",
            },
        });

        throw new AppError(
            "Payment verification failed.",
            400,
            "INVALID_PAYMENT"
        );
    }

    // 4. Mark order paid
    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },

        data: {
            paymentStatus: "PAID",
            razorpayPaymentId: razorpay_payment_id,
            status: "PROCESSING",
        },
    });

    return updatedOrder;
};