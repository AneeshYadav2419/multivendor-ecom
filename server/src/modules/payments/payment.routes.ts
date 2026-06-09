import { Router } from "express";
import * as paymentController from "./payment.controller.js";
import { protect, restrictTo } from "../../common/middlewares/authMiddleware.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";
import {
    createPaymentOrderSchema,
    verifyPaymentSchema,
} from "./paymentValidation.js";

const router = Router();

router.post(
    "/create-order",
    protect,
    restrictTo("CUSTOMER"),
    validate(createPaymentOrderSchema),
    paymentController.createPaymentOrder
);

router.post(
    "/verify",
    protect,
    restrictTo("CUSTOMER"),
    validate(verifyPaymentSchema),
    paymentController.verifyPayment
);

export default router;