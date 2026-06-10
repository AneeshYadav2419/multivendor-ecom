import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export function useRecentOrders() {
    return useQuery({
        queryKey: ["recent-orders"],
        queryFn: analyticsApi.getRecentOrders,
        staleTime: 1000 * 60 * 5,
    });
}