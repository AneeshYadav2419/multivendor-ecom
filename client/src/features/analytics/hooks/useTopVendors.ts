import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export function useTopVendors() {
    return useQuery({
        queryKey: ["top-vendors"],
        queryFn: analyticsApi.getTopVendors,
        staleTime: 1000 * 60 * 5,
    });
}