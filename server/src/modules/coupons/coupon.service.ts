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
            startsAt: data.startsAt
                ? new Date(data.startsAt)
                : null,
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
        console.log("INPUT CODE:", code);
        const coupon =
            await prisma.coupon.findFirst({
                where: {
                    code,
                    isActive: true,
                },
            });
        console.log("FOUND COUPON:", coupon);

        if (!coupon) {
            throw new Error(
                "Invalid coupon"
            );
        }

        if (
            coupon.startsAt &&
            new Date() < coupon.startsAt
        ) {
            throw new Error(
                "Coupon is not active yet"
            );
        }

        if (
            coupon.expiresAt &&
            new Date() > coupon.expiresAt
        ) {
            throw new Error(
                "Coupon has expired"
            );
        }

        if (
            coupon.usageLimit &&
            coupon.usedCount >=
            coupon.usageLimit
        ) {
            throw new Error(
                "Coupon usage limit reached"
            );
        }

        if (
            coupon.minOrderAmount &&
            cartTotal <
            coupon.minOrderAmount
        ) {
            throw new Error(
                `Minimum order amount is ₹${coupon.minOrderAmount}`
            );
        }

        let discountAmount = 0;

        if (
            coupon.discountType ===
            "PERCENTAGE"
        ) {
            discountAmount =
                (cartTotal *
                    coupon.discountValue) /
                100;
        }

        if (
            coupon.discountType ===
            "FIXED"
        ) {
            discountAmount =
                coupon.discountValue;
        }

        const finalAmount =
            Math.max(
                0,
                cartTotal -
                discountAmount
            );

        return {
            code: coupon.code,
            discountAmount,
            finalAmount,
        };
    }

};