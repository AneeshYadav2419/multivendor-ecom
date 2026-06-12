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
};