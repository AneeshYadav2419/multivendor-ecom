import prisma from "../../config/prismaClient.js"
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
};