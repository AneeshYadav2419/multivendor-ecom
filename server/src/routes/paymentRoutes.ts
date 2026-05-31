import { Router } from "express";

import * as paymentController from "../controllers/paymentController.js";

import { protect, restrictTo } from "../common/middlewares/authMiddleware.js";

import { validate } from "../common/middlewares/validateMiddleware.js";

import {
    createPaymentOrderSchema,
    verifyPaymentSchema,
} from "../validations/paymentValidation.js";

const router = Router();

/**
 * CREATE PAYMENT ORDER
 */
router.post(
    "/create-order",
    protect,
    restrictTo("CUSTOMER"),
    validate(createPaymentOrderSchema),
    paymentController.createPaymentOrder
);

/**
 * VERIFY PAYMENT
 */
router.post(
    "/verify",
    protect,
    restrictTo("CUSTOMER"),
    validate(verifyPaymentSchema),
    paymentController.verifyPayment
);

export default router;