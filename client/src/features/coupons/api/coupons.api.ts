import { api } from "@/lib/api/axios";
import { Coupon } from "../types/coupon.types";

export const couponsApi = {
    async getCoupons() {
        const res = await api.get<{
            success: boolean;
            data: Coupon[];
        }>("/admin/coupons");

        return res.data.data;
    },
    async createCoupon(data: any) {
        const res = await api.post(
            "/admin/coupons",
            data
        );

        return res.data.data;
    },
    async updateCoupon(
        id: string,
        data: any
    ) {
        const res = await api.patch(
            `/admin/coupons/${id}`,
            data
        );

        return res.data.data;
    },
    // async toggleCouponStatus(
    //     id: string,
    //     isActive: boolean
    // ) {
    //     const res = await api.patch(
    //         `/admin/coupons/${id}/status`,
    //         {
    //             isActive,
    //         }
    //     );

    //     return res.data.data;
    // }
    async toggleCouponStatus(
        id: string,
        isActive: boolean
    ) {
        const res = await api.patch(
            `/admin/coupons/${id}/status`,
            {
                isActive,
            }
        );

        return res.data.data;
    },
    async deleteCoupon(id: string) {
        const res = await api.delete(
            `/admin/coupons/${id}`
        );

        return res.data;
    },
};