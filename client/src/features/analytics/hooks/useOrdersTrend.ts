import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export function useOrdersTrend() {
    return useQuery({
        queryKey: ["orders-trend"],
        queryFn: analyticsApi.getOrdersTrend,
        staleTime: 1000 * 60 * 5,
    });
}