import { api } from "@/lib/api/axios";
import { AnalyticsDashboardResponse } from "../types/analytics.types";

export const analyticsApi = {
    async getDashboardOverview() {
        const response =
            await api.get<AnalyticsDashboardResponse>(
                "/admin/analytics/dashboard"
            );

        return response.data.data;
    },
};