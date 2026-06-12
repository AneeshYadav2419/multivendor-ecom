// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { couponsApi } from "../api/coupons.api";

// export const useToggleCoupon =
//     () => {

//         const queryClient =
//             useQueryClient();

//         return useMutation({
//             mutationFn: ({
//                 id,
//                 isActive,
//             }: {
//                 id: string;
//                 isActive: boolean;
//             }) =>
//                 couponsApi.toggleCouponStatus(
//                     id,
//                     isActive
//                 ),

//             onSuccess: () => {
//                 queryClient.invalidateQueries({
//                     queryKey: ["coupons"],
//                 });
//             },
//         });
//     };

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { couponsApi }
    from "../api/coupons.api";

export const useToggleCoupon =
    () => {

        const queryClient =
            useQueryClient();

        return useMutation({
            mutationFn: ({
                id,
                isActive,
            }: {
                id: string;
                isActive: boolean;
            }) =>
                couponsApi.toggleCouponStatus(
                    id,
                    isActive
                ),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["coupons"],
                });
            },
        });
    };