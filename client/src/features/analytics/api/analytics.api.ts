import { api } from "@/lib/api/axios";
import { AnalyticsDashboardResponse } from "../types/analytics.types";
import { RevenueTrendItem, OrdersTrendItem, TopProduct, TopVendor, RecentOrder } from "../types/analytics.types";

export const analyticsApi = {
    async getDashboardOverview() {
        const response =
            await api.get<AnalyticsDashboardResponse>(
                "/admin/analytics/dashboard"
            );

        return response.data.data;
    },

    async getRevenueTrend() {
        const response = await api.get<{
            success: boolean;
            data: RevenueTrendItem[];
        }>("/admin/analytics/revenue-trend");

        return response.data.data;
    },
    async getOrdersTrend() {
        const response = await api.get<{
            success: boolean;
            data: OrdersTrendItem[];
        }>("/admin/analytics/orders-trend");

        return response.data.data;
    },
    async getTopProducts() {
        const response = await api.get<{
            success: boolean;
            data: TopProduct[];
        }>("/admin/analytics/top-products");

        return response.data.data;
    },
    async getTopVendors() {
        const response = await api.get<{
            success: boolean;
            data: TopVendor[];
        }>("/admin/analytics/top-vendors");

        return response.data.data;
    },
    async getRecentOrders() {
        const response = await api.get<{
            success: boolean;
            data: RecentOrder[];
        }>("/admin/analytics/recent-orders");

        return response.data.data;
    },
};
