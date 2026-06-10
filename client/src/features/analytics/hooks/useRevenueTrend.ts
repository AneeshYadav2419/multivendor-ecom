import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export function useRevenueTrend() {
    return useQuery({
        queryKey: ["revenue-trend"],
        queryFn: analyticsApi.getRevenueTrend,
        staleTime: 1000 * 60 * 5,
    });
}