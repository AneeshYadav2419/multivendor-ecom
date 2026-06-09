
import { Request, Response, NextFunction } from "express";
import * as orderService from "./orderService.js";
import { catchAsync } from "../../utils/catchAsync.js";

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
// import { Request, Response } from "express";
// import * as orderService from "./orderService.js";
// import { catchAsync } from "../../utils/catchAsync.js";

// /**
//  * PLACE ORDER
//  */
// export const placeOrder = catchAsync(async (req: Request, res: Response) => {
//     console.time("PLACE_ORDER_API");

//     if (!req.user?.userId) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//         });
//     }

//     const order = await orderService.placeOrderService(
//         req.user.userId,
//         req.body
//     );

//     console.timeEnd("PLACE_ORDER_API");

//     return res.status(201).json({
//         success: true,
//         message: "Order placed successfully",
//         data: order ?? null,
//     });
// });

// /**
//  * GET MY ORDERS
//  */
// export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
//     console.time("GET_MY_ORDERS");

//     if (!req.user?.userId) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//         });
//     }

//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const result = await orderService.getMyOrdersService(req.user.userId, {
//         page,
//         limit,
//     });

//     console.timeEnd("GET_MY_ORDERS");

//     // ✅ SAFE NORMALIZATION
//     const data = result?.data ?? [];
//     const pagination = result?.pagination ?? {
//         page,
//         limit,
//         total: 0,
//         totalPages: 0,
//     };

//     return res.status(200).json({
//         success: true,
//         results: data.length,
//         pagination,
//         data,
//     });
// });

// /**
//  * GET SINGLE ORDER
//  */
// export const getOrderById = catchAsync(async (req: Request, res: Response) => {
//     const orderId = req.params.id;

//     if (!req.user?.userId) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//         });
//     }

//     if (!orderId) {
//         return res.status(400).json({
//             success: false,
//             message: "Order ID is required",
//         });
//     }

//     const order = await orderService.getOrderByIdService(
//         orderId,
//         req.user.userId
//     );

//     return res.status(200).json({
//         success: true,
//         data: order ?? null,
//     });
// });