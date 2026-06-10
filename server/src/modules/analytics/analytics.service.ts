
import { analyticsRepository } from "./analytics.repository.js";
import { DashboardOverview } from "./analytics.types.js";

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
};