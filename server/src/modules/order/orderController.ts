
// import { Request, Response, NextFunction } from "express";
// import * as orderService from "./orderService.js";
// import { catchAsync } from "../../utils/catchAsync.js";

// /**
//  * PLACE ORDER
//  */
// export const placeOrder = catchAsync(async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {

//     const order = await orderService.placeOrderService(
//         req.user!.userId,
//         req.body
//     );

//     res.status(201).json({
//         success: true,
//         message: "Order placed successfully",
//         data: order,
//     });
// });

// /**
//  * GET MY ORDERS
//  */
// export const getMyOrders = catchAsync(async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const orders = await orderService.getMyOrdersService(
//         req.user!.userId
//     );

//     res.status(200).json({
//         success: true,
//         results: orders.length,
//         data: orders,
//     });
// });

// /**
//  * GET SINGLE ORDER
//  */
// export const getOrderById = catchAsync(async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const orderId = req.params.id as string;

//     const order = await orderService.getOrderByIdService(
//         orderId,
//         req.user!.userId
//     );

//     res.status(200).json({
//         success: true,
//         data: order,
//     });
// });
import { Request, Response } from "express";
import * as orderService from "./orderService.js";
import { catchAsync } from "../../utils/catchAsync.js";

/**
 * PLACE ORDER
 */
export const placeOrder = catchAsync(async (
    req: Request,
    res: Response
) => {
    console.time("PLACE_ORDER_API");

    const order = await orderService.placeOrderService(
        req.user!.userId,
        req.body
    );

    console.timeEnd("PLACE_ORDER_API");

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
    res: Response
) => {
    console.time("GET_MY_ORDERS");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const orders = await orderService.getMyOrdersService(
        req.user!.userId,
        { page, limit }
    );

    console.timeEnd("GET_MY_ORDERS");

    res.status(200).json({
        success: true,
        results: orders.data.length,
        pagination: orders.pagination,
        data: orders.data,
    });
});

/**
 * GET SINGLE ORDER
 */
export const getOrderById = catchAsync(async (
    req: Request,
    res: Response
) => {
    const orderId = req.params.id;

    const order = await orderService.getOrderByIdService(
        orderId,
        req.user!.userId
    );

    res.status(200).json({
        success: true,
        data: order,
    });
});