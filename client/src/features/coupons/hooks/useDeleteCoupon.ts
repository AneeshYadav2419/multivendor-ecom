import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { couponsApi }
    from "../api/coupons.api";

export const useDeleteCoupon =
    () => {

        const queryClient =
            useQueryClient();

        return useMutation({
            mutationFn: (id: string) =>
                couponsApi.deleteCoupon(id),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["coupons"],
                });
            },
        });
    };