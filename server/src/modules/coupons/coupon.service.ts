import { couponRepository }
    from "./coupon.repository.js";

import { CreateCouponDto, UpdateCouponDto }
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

    // async updateCoupon(
    //     id: string,
    //     data: UpdateCouponDto
    // ) {
    //     return couponRepository.update(
    //         id,
    //         data
    //     );
    // },
    async updateCoupon(
        id: string,
        data: UpdateCouponDto
    ) {

        console.log(
            "SERVICE DATA",
            data
        );

        return couponRepository.update(
            id,
            {
                ...data,
                discountValue:
                    data.discountValue !== undefined
                        ? Number(data.discountValue)
                        : undefined,

                usageLimit:
                    data.usageLimit !== undefined
                        ? Number(data.usageLimit)
                        : undefined,
            }
        );
    },
};