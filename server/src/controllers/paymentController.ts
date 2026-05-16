import { Request, Response, NextFunction } from "express";

import * as paymentService from "../services/paymentService.js";

/**
 * CREATE PAYMENT ORDER
 */
export const createPaymentOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { orderId } = req.body;

        const payment =
            await paymentService.createPaymentOrderService(
                orderId,
                req.user!.userId
            );

        res.status(200).json({
            success: true,
            data: payment,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        const payment =
            await paymentService.verifyPaymentService(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                orderId
            );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: payment,
        });

    } catch (error) {
        next(error);
    }
};