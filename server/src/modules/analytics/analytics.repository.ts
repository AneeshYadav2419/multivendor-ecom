// import prisma from "../../config/prismaClient.js"
// export const analyticsRepository = {
//     async getRevenue() {
//         const result = await prisma.order.aggregate({
//             where: {
//                 paymentStatus: "PAID",
//             },
//             _sum: {
//                 totalAmount: true,
//             },
//         });

//         return Number(result._sum.totalAmount ?? 0);
//     },

//     async getOrdersCount() {
//         return prisma.order.count();
//     },

//     async getCustomersCount() {
//         return prisma.user.count({
//             where: {
//                 role: "CUSTOMER",
//             },
//         });
//     },

//     async getVendorsCount() {
//         return prisma.vendor.count({
//             where: {
//                 status: "APPROVED",
//             },
//         });
//     },
// };
import prisma from "../../config/prismaClient.js";

export const analyticsRepository = {
    async getRevenue() {
        const result = await prisma.order.aggregate({
            where: {
                paymentStatus: "PAID",
            },
            _sum: {
                totalAmount: true,
            },
        });

        return Number(result._sum.totalAmount ?? 0);
    },

    async getOrdersCount() {
        return prisma.order.count();
    },

    async getCustomersCount() {
        return prisma.user.count({
            where: {
                role: "CUSTOMER",
            },
        });
    },

    async getVendorsCount() {
        return prisma.vendor.count({
            where: {
                status: "APPROVED",
            },
        });
    },

    /**
     * Revenue Trend Source Data
     * Business logic service layer me hoga
     */
    async getRevenueTrendData() {
        return prisma.order.findMany({
            where: {
                paymentStatus: "PAID",
            },
            select: {
                totalAmount: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    },
    async getOrdersTrendData() {
        return prisma.order.findMany({
            select: {
                id: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    },
    async getTopProductsData() {
        return prisma.orderItem.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    },
    async getTopVendorsData() {
        return prisma.orderItem.findMany({
            include: {
                vendor: {
                    select: {
                        id: true,
                        storeName: true,
                    },
                },
            },
        });
    },
    async getRecentOrdersData() {
        return prisma.order.findMany({
            take: 5,

            orderBy: {
                createdAt: "desc",
            },

            include: {
                customer: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    },
};