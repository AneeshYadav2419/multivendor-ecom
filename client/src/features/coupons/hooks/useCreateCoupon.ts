import { useMutation, useQueryClient } from "@tanstack/react-query";

import { couponsApi } from "../api/coupons.api";
import { toast } from "sonner";

export const useCreateCoupon = () => {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
            couponsApi.createCoupon,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["coupons"],
            });

            toast.success(
                "Coupon created successfully"
            );
        },

        onError: () => {
            toast.error(
                "Failed to create coupon"
            );
        },
    });
};