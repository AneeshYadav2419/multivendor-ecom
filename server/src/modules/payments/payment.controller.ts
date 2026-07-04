import { Request, Response } from "express";
import crypto from "crypto";
import razorpay from "../../config/razorpay.js";
import prisma from "../../config/prismaClient.js";

/**
 * 1. CREATE RAZORPAY ORDER
 */
export const createPaymentOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        // Fetch order from DB to get the secure, server-calculated total
        const dbOrder = await prisma.order.findUnique({
            where: { id: orderId },
            select: { totalAmount: true, customerId: true }
        });

        if (!dbOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Access check: Ensure the order belongs to the requesting customer
        if (dbOrder.customerId !== req.user!.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this order",
            });
        }

        const amount = Number(dbOrder.totalAmount);
        const amountInPaise = Math.round(amount * 100); // Convert rupees → paise

        console.log(
            `[Razorpay] Creating order: ${amountInPaise} paise | rawAmount=₹${amount}`
        );

        // Razorpay test mode max = ₹5,00,000 (50,000,000 paise)
        // Production limit is ₹10,00,000 per transaction by default.
        const RAZORPAY_MAX_PAISE = 50_000_000; // ₹5,00,000
        if (amountInPaise > RAZORPAY_MAX_PAISE) {
            return res.status(400).json({
                success: false,
                message: `Order amount ₹${amount.toFixed(2)} exceeds the maximum allowed per transaction (₹5,00,000). Please split the order or contact support.`,
            });
        }

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Update the order in the database with the generated razorpayOrderId
        await prisma.order.update({
            where: { id: orderId },
            data: { razorpayOrderId: order.id }
        });

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

        // Fetch the database order
        const dbOrder = await prisma.order.findUnique({
            where: { id: orderId },
            select: { customerId: true, razorpayOrderId: true }
        });

        if (!dbOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Ensure order ownership
        if (dbOrder.customerId !== req.user!.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized order verification",
            });
        }

        // Prevent exploit: Validate that the Razorpay order ID matches what was created for this DB order
        if (dbOrder.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Payment order mismatch",
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