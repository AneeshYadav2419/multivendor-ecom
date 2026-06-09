import { Request, Response } from "express";
import razorpay from "../../config/razorpay.js";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options as any);

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({ message: "Order creation failed" });
    }
};