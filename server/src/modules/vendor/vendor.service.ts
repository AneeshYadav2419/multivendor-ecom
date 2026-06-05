import { VendorStatus } from "@prisma/client";

import * as vendorRepository from "./vendor.repository.js";
import prisma from "../../config/prismaClient.js";

console.log("🔥 VENDOR SERVICE FILE LOADED");


export const getVendorProfileService =
    async (userId: string) => {

        const vendor =
            await vendorRepository.findVendorByUserId(
                userId
            );

        if (!vendor) {
            throw new Error(
                "Vendor profile not found"
            );
        }

        return vendor;
    };

export const updateVendorProfileService =
    async (
        userId: string,
        payload: any
    ) => {

        const vendor =
            await vendorRepository.findVendorByUserId(
                userId
            );

        if (!vendor) {
            throw new Error(
                "Vendor profile not found"
            );
        }

        return vendorRepository.updateVendorProfile(
            userId,
            payload
        );
    };

export const getAllVendorsService =
    async () => {

        return vendorRepository.getAllVendors();
    };

export const getVendorsByStatusService =
    async (
        status: VendorStatus
    ) => {

        return vendorRepository.getVendorsByStatus(
            status
        );
    };

export const updateVendorStatusService =
    async (
        vendorId: string,
        status: VendorStatus
    ) => {

        const vendor =
            await vendorRepository.findVendorById(
                vendorId
            );

        if (!vendor) {
            throw new Error(
                "Vendor not found"
            );
        }

        return vendorRepository.updateVendorStatus(
            vendorId,
            status
        );
    };


// export const getDashboardStats = async (userId: string) => {
//     const vendor = await prisma.vendor.findUnique({
//         where: { userId },
//     });

//     if (!vendor) {
//         throw new Error("Vendor not found");
//     }

//     const [
//         totalProducts,
//         activeProducts,
//         lowStockProducts
//     ] = await Promise.all([
//         prisma.product.count({
//             where: {
//                 vendorId: vendor.id,
//             },
//         }),

//         prisma.product.count({
//             where: {
//                 vendorId: vendor.id,
//                 status: "ACTIVE",
//             },
//         }),

//         prisma.product.count({
//             where: {
//                 vendorId: vendor.id,
//                 stock: {
//                     lte: 5,
//                 },
//             },
//         }),
//     ]);
//     console.log("VENDOR SERVICE FILE LOADED");

//     return {
//         totalProducts,
//         activeProducts,
//         lowStockProducts,
//     };
// };
export const getDashboardStats = async (userId: string) => {
    const vendor = await prisma.vendor.findUnique({
        where: { userId },
    });

    if (!vendor) {
        throw new Error("Vendor not found");
    }

    const [
        totalProducts,
        activeProducts,
        pendingProducts,
        orderItems,
        recentOrders,
    ] = await Promise.all([
        prisma.product.count({
            where: {
                vendorId: vendor.id,
            },
        }),

        prisma.product.count({
            where: {
                vendorId: vendor.id,
                status: "ACTIVE",
            },
        }),

        prisma.product.count({
            where: {
                vendorId: vendor.id,
                status: "DRAFT",
            },
        }),

        prisma.orderItem.findMany({
            where: {
                product: {
                    vendorId: vendor.id,
                },
            },
            include: {
                order: true,
            },
        }),

        prisma.order.findMany({
            where: {
                orderItems: {
                    some: {
                        product: {
                            vendorId: vendor.id,
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
    ]);

    const totalOrders = orderItems.length;

    const revenue = orderItems.reduce(
        (sum, item) =>
            sum + Number(item.price) * item.quantity,
        0
    );

    return {
        totalProducts,
        activeProducts,
        pendingProducts,
        totalOrders,
        revenue,
        recentOrders,
    };
};