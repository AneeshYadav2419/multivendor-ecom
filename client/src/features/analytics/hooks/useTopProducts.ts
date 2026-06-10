import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export function useTopProducts() {
    return useQuery({
        queryKey: ["top-products"],
        queryFn: analyticsApi.getTopProducts,
        staleTime: 1000 * 60 * 5,
    });
}