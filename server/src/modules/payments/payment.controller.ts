import { Request, Response } from "express";
import crypto from "crypto";
import razorpay from "../../config/razorpay.js";
import prisma from "../../config/prismaClient.js";

/**
 * 1. CREATE RAZORPAY ORDER
 */
export const createPaymentOrder = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount provided",
            });
        }

        // ─── TEST MODE: Always use ₹1 (100 paise) for Razorpay ───────────────
        // Razorpay test mode can reject amounts due to stale localStorage values,
        // Prisma Decimal precision, or high product prices. The real order total
        // is already saved correctly in the DB BEFORE this endpoint is called.
        const isTestMode = (process.env.RAZORPAY_KEY_ID ?? "").startsWith("rzp_test_");
        const amountInPaise = isTestMode
            ? 100  // Always ₹1 in test mode — safe, reliable, no limit errors
            : Math.round(Number(amount) * 100); // Real paise in production

        console.log(
            `[Razorpay] Creating order: ${amountInPaise} paise | isTestMode=${isTestMode} | rawAmount=${amount}`
        );

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.json({
            success: true,
            order,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error("[Razorpay] createPaymentOrder error:", error);
        return res.status(500).json({
            success: false,
            message: error?.error?.description || error?.message || "Order creation failed",
        });
    }
};

/**
 * 2. VERIFY PAYMENT
 */
// export const verifyPayment = async (req: Request, res: Response) => {
//     const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         orderId,
//     } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const secret = process.env.RAZORPAY_SECRET;

//     if (!secret) {
//         return res.status(500).json({
//             success: false,
//             message: "Missing Razorpay secret",
//         });
//     }

//     const expectedSignature = crypto
//         .createHmac("sha256", secret)
//         .update(body)
//         .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//         // 🔥 IMPORTANT: update DB order here
//         // await Order.update({ status: "PAID" })

//         return res.json({
//             success: true,
//             message: "Payment verified successfully",
//         });
//     }

//     return res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//     });
// };

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        console.log("VERIFY BODY:", req.body);
        console.log("ORDER ID:", orderId);
        console.log("RAZORPAY ORDER ID:", razorpay_order_id);
        console.log("PAYMENT ID:", razorpay_payment_id);

        // =========================
        // VALIDATION
        // =========================
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !orderId
        ) {
            return res.status(422).json({
                success: false,
                message: "Missing payment fields",
            });
        }

        // =========================
        // SECRET
        // =========================
        const secret = process.env.RAZORPAY_KEY_SECRET;

        console.log("KEY_SECRET =", secret);

        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Missing Razorpay secret",
            });
        }

        // =========================
        // VERIFY SIGNATURE
        // =========================
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        console.log("EXPECTED:", expectedSignature);
        console.log("RECEIVED:", razorpay_signature);

        // =========================
        // INVALID PAYMENT
        // =========================
        if (expectedSignature !== razorpay_signature) {
            await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    paymentStatus: "FAILED",
                },
            });

            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }

        // =========================
        // SUCCESS
        // =========================
        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: "PROCESSING",
                paymentStatus: "PAID",
                razorpayPaymentId: razorpay_payment_id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: updatedOrder,
        });
    } catch (error: any) {
        console.error("Verify payment error:", error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Server error",
            stack: error?.stack,
        });
    }
};