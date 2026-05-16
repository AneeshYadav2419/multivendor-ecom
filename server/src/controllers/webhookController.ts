import { Request, Response, NextFunction } from "express";
import * as webhookService from "../services/webhookService.js";

/**
 * Handle incoming Razorpay Webhooks
 */
export const razorpayWebhookController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const signature = req.headers["x-razorpay-signature"];

        if (!signature || typeof signature !== "string") {
            res.status(400).send("Missing or invalid signature");
            return;
        }

        // We pass req.body, which is a raw Buffer because of express.raw()
        await webhookService.handleRazorpayWebhookService(req.body, signature);

        // Always return 200 OK so Razorpay knows we received it
        res.status(200).json({ success: true });
        
    } catch (error: any) {
        // Log the error but still return 200 to prevent infinite Razorpay retries
        // (unless it's a critical server failure you WANT them to retry)
        console.error("Webhook processing error:", error.message);
        
        // If signature is invalid, we return 400.
        if (error.message === "Invalid Razorpay webhook signature") {
            res.status(400).send("Invalid signature");
            return;
        }

        res.status(500).send("Internal Webhook Error");
    }
};
