// routes/orderRoutes.ts

import { Router } from "express";
import * as orderController from "../controllers/orderController.js";

import { protect, restrictTo } from "../middlewares/authMiddleware.js";

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