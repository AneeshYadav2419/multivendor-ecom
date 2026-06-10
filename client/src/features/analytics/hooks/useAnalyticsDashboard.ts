import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export function useAnalyticsDashboard() {
    return useQuery({
        queryKey: ["analytics-dashboard"],
        queryFn: analyticsApi.getDashboardOverview,
        staleTime: 1000 * 60 * 5,
    });
}