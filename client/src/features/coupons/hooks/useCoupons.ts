import { useQuery } from "@tanstack/react-query";
import { couponsApi } from "../api/coupons.api";

export const useCoupons = () => {
    return useQuery({
        queryKey: ["coupons"],
        queryFn: couponsApi.getCoupons,
    });
};