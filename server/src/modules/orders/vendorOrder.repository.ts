import prisma from "../../config/prismaClient.js";

export const findVendorByUserId = async (
    userId: string
) => {
    return prisma.vendor.findUnique({
        where: {
            userId,
        },
    });
};

export const findVendorOrders = async (
    vendorId: string
) => {
    return prisma.order.findMany({
        where: {
            orderItems: {
                some: {
                    vendorId,
                },
            },
        },

        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            orderItems: {
                where: {
                    vendorId,
                },

                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: true,
                            price: true,
                        },
                    },
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findVendorOrderById = async (
    orderId: string,
    vendorId: string
) => {
    return prisma.order.findFirst({
        where: {
            id: orderId,

            orderItems: {
                some: {
                    vendorId,
                },
            },
        },

        include: {
            customer: true,

            orderItems: {
                where: {
                    vendorId,
                },

                include: {
                    product: true,
                },
            },
        },
    });
};

export const updateOrderStatusRepo = async (
    orderId: string,
    status: any
) => {
    return prisma.order.update({
        where: {
            id: orderId,
        },

        data: {
            status,
        },
    });
};