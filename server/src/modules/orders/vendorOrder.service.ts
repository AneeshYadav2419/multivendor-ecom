import { AppError } from "../../common/middlewares/errorMiddleware.js";

import {
    findVendorByUserId,
    findVendorOrders,
    findVendorOrderById,
    updateOrderStatusRepo,
} from "./vendorOrder.repository.js";

export const getVendorOrdersService = async (
    userId: string
) => {
    const vendor = await findVendorByUserId(userId);

    if (!vendor) {
        throw new AppError(
            "Vendor not found",
            404,
            "VENDOR_NOT_FOUND"
        );
    }

    return findVendorOrders(vendor.id);
};

export const getVendorOrderByIdService = async (
    userId: string,
    orderId: string
) => {
    const vendor = await findVendorByUserId(userId);

    if (!vendor) {
        throw new AppError(
            "Vendor not found",
            404,
            "VENDOR_NOT_FOUND"
        );
    }

    const order = await findVendorOrderById(
        orderId,
        vendor.id
    );

    if (!order) {
        throw new AppError(
            "Order not found",
            404,
            "ORDER_NOT_FOUND"
        );
    }

    return order;
};

export const updateVendorOrderStatusService =
    async (
        userId: string,
        orderId: string,
        status: any
    ) => {
        const vendor = await findVendorByUserId(userId);

        if (!vendor) {
            throw new AppError(
                "Vendor not found",
                404,
                "VENDOR_NOT_FOUND"
            );
        }

        const order = await findVendorOrderById(
            orderId,
            vendor.id
        );

        if (!order) {
            throw new AppError(
                "Order not found",
                404,
                "ORDER_NOT_FOUND"
            );
        }

        return updateOrderStatusRepo(
            orderId,
            status
        );
    };