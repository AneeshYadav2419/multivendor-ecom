
import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * PLACE ORDER
 */
export const placeOrder = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { shippingAddress, paymentMethod } = req.body;

    const order = await orderService.placeOrderService(
        req.user!.userId,
        shippingAddress,
        paymentMethod
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