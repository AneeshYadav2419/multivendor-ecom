import { couponRepository }
    from "./coupon.repository.js";

import { CreateCouponDto, UpdateCouponDto }
    from "./coupon.types.js";
import prisma from "../../config/prismaClient.js";

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
    async toggleCouponStatus(
        id: string,
        isActive: boolean
    ) {
        return couponRepository.toggleStatus(
            id,
            isActive
        );
    },
    async deleteCoupon(id: string) {
        return couponRepository.delete(id);
    },
    async applyCoupon(
        code: string,
        cartTotal: number
    ) {
        const coupon =
            await prisma.coupon.findFirst({
                where: {
                    code,
                    isActive: true,
                },
            });

        if (!coupon) {
            throw new Error("Invalid coupon");
        }

        let discountAmount = 0;

        if (coupon.type === "PERCENTAGE") {
            discountAmount =
                (cartTotal * coupon.value) / 100;
        }

        if (coupon.type === "FIXED") {
            discountAmount =
                coupon.value;
        }

        const finalAmount =
            cartTotal - discountAmount;

        return {
            code: coupon.code,
            discountAmount,
            finalAmount,
        };
    }

};