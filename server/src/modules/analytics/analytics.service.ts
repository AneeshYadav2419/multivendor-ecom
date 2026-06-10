
import { analyticsRepository } from "./analytics.repository.js";
import {
    DashboardOverview,
    RevenueTrendItem,
    OrdersTrendItem,
    TopProduct,
} from "./analytics.types.js";

export const analyticsService = {
    async getDashboardOverview(): Promise<DashboardOverview> {
        const [
            revenue,
            orders,
            customers,
            vendors,
        ] = await Promise.all([
            analyticsRepository.getRevenue(),
            analyticsRepository.getOrdersCount(),
            analyticsRepository.getCustomersCount(),
            analyticsRepository.getVendorsCount(),
        ]);

        return {
            revenue,
            orders,
            customers,
            vendors,
        };
    },

    async getRevenueTrend(): Promise<RevenueTrendItem[]> {
        const orders =
            await analyticsRepository.getRevenueTrendData();

        const revenueMap = new Map<string, number>();

        orders.forEach((order) => {
            const monthKey = order.createdAt.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric",
                }
            );

            const amount = Number(order.totalAmount);

            revenueMap.set(
                monthKey,
                (revenueMap.get(monthKey) ?? 0) + amount
            );
        });

        return Array.from(
            revenueMap.entries()
        ).map(([month, revenue]) => ({
            month,
            revenue,
        }));
    },
    async getOrdersTrend(): Promise<OrdersTrendItem[]> {
        const orders =
            await analyticsRepository.getOrdersTrendData();

        const ordersMap = new Map<string, number>();

        orders.forEach((order) => {
            const month = order.createdAt.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric",
                }
            );

            ordersMap.set(
                month,
                (ordersMap.get(month) ?? 0) + 1
            );
        });

        return Array.from(
            ordersMap.entries()
        ).map(([month, orders]) => ({
            month,
            orders,
        }));
    },
    async getTopProducts(): Promise<TopProduct[]> {
        const items =
            await analyticsRepository.getTopProductsData();

        const productsMap = new Map<
            string,
            TopProduct
        >();

        items.forEach((item) => {
            const productId = item.product.id;
            const productName = item.product.name;

            const revenue =
                Number(item.price) * item.quantity;

            if (!productsMap.has(productId)) {
                productsMap.set(productId, {
                    productId,
                    name: productName,
                    orders: 0,
                    revenue: 0,
                });
            }

            const existing =
                productsMap.get(productId)!;

            existing.orders += item.quantity;
            existing.revenue += revenue;
        });

        return Array.from(productsMap.values())
            .sort(
                (a, b) => b.orders - a.orders
            )
            .slice(0, 5);
    }
};