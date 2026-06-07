import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync.js";

import {
    getVendorOrdersService,
    getVendorOrderByIdService,
    updateVendorOrderStatusService,
} from "./vendorOrder.service.js";

export const getVendorOrders = catchAsync(
    async (req: Request, res: Response) => {
        const orders =
            await getVendorOrdersService(
                req.user!.userId
            );

        res.status(200).json({
            success: true,
            results: orders.length,
            data: orders,
        });
    }
);

export const getVendorOrderById =
    catchAsync(async (req, res) => {
        const order =
            await getVendorOrderByIdService(
                req.user!.userId,
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: order,
        });
    });

export const updateOrderStatus =
    catchAsync(async (req, res) => {
        const updated =
            await updateVendorOrderStatusService(
                req.user!.userId,
                req.params.id,
                req.body.status
            );

        res.status(200).json({
            success: true,
            message: "Order updated",
            data: updated,
        });
    });