import prisma from "../../config/prismaClient.js";
import { VendorStatus } from "@prisma/client";

export const findVendorByUserId = (
    userId: string
) => {
    return prisma.vendor.findUnique({
        where: {
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const updateVendorProfile = (
    userId: string,
    payload: any
) => {
    return prisma.vendor.update({
        where: {
            userId,
        },
        data: payload,
    });
};

export const getAllVendors = () => {
    return prisma.vendor.findMany({
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getVendorsByStatus = (
    status: VendorStatus
) => {
    return prisma.vendor.findMany({
        where: {
            status,
        },
        include: {
            user: true,
        },
    });
};

export const updateVendorStatus = (
    vendorId: string,
    status: VendorStatus
) => {
    return prisma.vendor.update({
        where: {
            id: vendorId,
        },
        data: {
            status,
        },
    });
};

export const findVendorById = (
    vendorId: string
) => {
    return prisma.vendor.findUnique({
        where: {
            id: vendorId,
        },
    });
};