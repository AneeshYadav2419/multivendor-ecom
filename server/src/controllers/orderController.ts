
import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService.js";

/**
 * PLACE ORDER
 */
export const placeOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

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

    } catch (error) {
        next(error);
    }
};

/**
 * GET MY ORDERS
 */
export const getMyOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const orders = await orderService.getMyOrdersService(
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            results: orders.length,
            data: orders,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET SINGLE ORDER
 */
export const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const orderId = req.params.id as string;

        const order = await orderService.getOrderByIdService(
            orderId,
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            data: order,
        });

    } catch (error) {
        next(error);
    }
};