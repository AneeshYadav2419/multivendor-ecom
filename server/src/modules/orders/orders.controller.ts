import { Request, Response, NextFunction } from "express";
import * as orderService from "./orders.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

/**
 * ─────────────────────────────────────────────────────────
 * CUSTOMER CONTROLLERS
 * ─────────────────────────────────────────────────────────
 */

/**
 * PLACE ORDER
 */
export const placeOrder = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const order = await orderService.placeOrderService(
        req.user!.userId,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
    });
});

/**
 * GET MY ORDERS
 */
export const getMyOrders = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const orders = await orderService.getMyOrdersService(
        req.user!.userId
    );

    res.status(200).json({
        success: true,
        results: orders.length,
        data: orders,
    });
});

/**
 * GET SINGLE ORDER
 */
export const getOrderById = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const orderId = req.params.id as string;
    const order = await orderService.getOrderByIdService(
        orderId,
        req.user!.userId
    );

    res.status(200).json({
        success: true,
        data: order,
    });
});

/**
 * ─────────────────────────────────────────────────────────
 * VENDOR CONTROLLERS
 * ─────────────────────────────────────────────────────────
 */

/**
 * GET VENDOR ORDERS
 */
export const getVendorOrders = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const orders = await orderService.getVendorOrdersService(
        req.user!.userId
    );

    res.status(200).json({
        success: true,
        results: orders.length,
        data: orders,
    });
});

/**
 * GET SINGLE VENDOR ORDER BY ID
 */
export const getVendorOrderById = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const order = await orderService.getVendorOrderByIdService(
        req.user!.userId,
        req.params.id as string
    );

    res.status(200).json({
        success: true,
        data: order,
    });
});

/**
 * UPDATE VENDOR ORDER STATUS
 */
export const updateOrderStatus = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const updated = await orderService.updateVendorOrderStatusService(
        req.user!.userId,
        req.params.id as string,
        req.body.status
    );

    res.status(200).json({
        success: true,
        message: "Order updated",
        data: updated,
    });
});
