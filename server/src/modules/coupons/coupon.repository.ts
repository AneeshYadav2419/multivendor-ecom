import prisma from "../../config/prismaClient.js";
import { CreateCouponDto } from "./coupon.types.js";

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
};