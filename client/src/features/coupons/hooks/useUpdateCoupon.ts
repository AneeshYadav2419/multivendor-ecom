import { useMutation }
    from "@tanstack/react-query";

import { useQueryClient }
    from "@tanstack/react-query";

import { couponsApi }
    from "../api/coupons.api";

export const useUpdateCoupon = () => {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: any;
        }) =>
            couponsApi.updateCoupon(
                id,
                data
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["coupons"],
            });
        },
    });
};