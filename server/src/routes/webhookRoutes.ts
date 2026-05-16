import { Router } from "express";
import express from "express";
import * as webhookController from "../controllers/webhookController.js";

const router = Router();

/**
 * POST /api/webhooks/razorpay
 * 
 * We use express.raw() here BEFORE any global express.json() can parse it.
 * This is critical because Razorpay's signature requires the exact raw string body.
 */
router.post(
    "/razorpay",
    express.raw({ type: "application/json" }),
    webhookController.razorpayWebhookController
);

export default router;
