// routes/orderRoutes.ts

import { Router } from "express";
import * as orderController from "./orderController.js";

import { protect, restrictTo } from "../../common/middlewares/authMiddleware.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";
import { placeOrderSchema } from "./orderValidation.js";

const router = Router();

/**
 * @route   POST /api/orders
 * @desc    Place a new order
 * @access  Private (Customer)
 */
router.post(
    "/",
    protect,
    restrictTo("CUSTOMER"),
    validate(placeOrderSchema),
    orderController.placeOrder
);

/**
 * @route   GET /api/orders/my
 * @desc    Get logged-in customer's orders
 * @access  Private (Customer)
 */
router.get(
    "/my",
    protect,
    restrictTo("CUSTOMER"),
    orderController.getMyOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private (Customer)
 */
router.get(
    "/:id",
    protect,
    restrictTo("CUSTOMER"),
    orderController.getOrderById
);

export default router;