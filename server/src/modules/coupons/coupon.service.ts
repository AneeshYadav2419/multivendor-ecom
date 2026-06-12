import { couponRepository }
    from "./coupon.repository.js";

import { CreateCouponDto }
    from "./coupon.types.js";

export const couponService = {
    async createCoupon(
        data: CreateCouponDto
    ) {
        return couponRepository.create({
            ...data,
            expiresAt: data.expiresAt
                ? new Date(data.expiresAt)
                : null,
        });
    },

    async getCoupons() {
        return couponRepository.findAll();
    },
};