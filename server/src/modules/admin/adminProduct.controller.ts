import { Request, Response } from "express";
import prisma from "../../config/prismaClient.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";

export const getPendingProducts = catchAsync(
    async (_req: Request, res: Response) => {
        const products = await prisma.product.findMany({
            where: {
                status: "DRAFT",
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        storeName: true,
                    },
                },
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            results: products.length,
            data: products,
        });
    }
);

export const approveProduct = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Product id required", 400);
        }


        if (!id || Array.isArray(id)) {
            throw new Error("Invalid product id");
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                status: "ACTIVE",
            },
        });

        res.status(200).json({
            success: true,
            message: "Product approved successfully",
            data: product,
        });
    }
);

export const rejectProduct = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            throw new Error("Invalid product id");
        }


        const product = await prisma.product.update({
            where: { id },
            data: {
                status: "ARCHIVED",
            },
        });

        res.status(200).json({
            success: true,
            message: "Product rejected",
            data: product,
        });
    }
);