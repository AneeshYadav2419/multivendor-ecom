import prisma from "../../config/prismaClient.js";
import { CreateCouponDto, UpdateCouponDto } from "./coupon.types.js";

export const couponRepository = {
    async create(data: CreateCouponDto) {
        return prisma.coupon.create({
            data,
        });
    },

    async findAll() {
        return prisma.coupon.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // async update(
    //     id: string,
    //     data: UpdateCouponDto
    // ) {
    //     return prisma.coupon.update({
    //         where: {
    //             id,
    //         },
    //         data,
    //     });
    // },
    async update(
        id: string,
        data: UpdateCouponDto
    ) {

        console.log(
            "REPOSITORY DATA",
            data
        );

        return prisma.coupon.update({
            where: { id },
            data,
        });
    },
};