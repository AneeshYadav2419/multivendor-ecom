import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";

export interface CreateReviewDTO {
    rating: number;
    comment?: string;
}

/**
 * Get all reviews for a product with user info.
 */
export const getProductReviews = async (productId: string) => {
    const reviews = await prisma.review.findMany({
        where: { productId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const total = reviews.length;
    const average =
        total > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;

    return {
        reviews,
        total,
        average: parseFloat(average.toFixed(1)),
    };
};

/**
 * Create a review.
 * One review per user per product — enforced here
 * (no unique constraint in schema, so we check manually).
 */
export const createReview = async (
    userId: string,
    productId: string,
    data: CreateReviewDTO
) => {
    // Product must exist
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });

    if (!product) {
        throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    }

    // One review per user per product
    const existing = await prisma.review.findFirst({
        where: { userId, productId },
    });

    if (existing) {
        throw new AppError(
            "You have already reviewed this product",
            409,
            "ALREADY_REVIEWED"
        );
    }

    const review = await prisma.review.create({
        data: {
            userId,
            productId,
            rating: data.rating,
            comment: data.comment ?? null,
        },
        include: {
            user: {
                select: { id: true, name: true },
            },
        },
    });

    return review;
};

/**
 * Delete a review — only the author can delete their own review.
 */
export const deleteReview = async (
    userId: string,
    reviewId: string
) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { userId: true },
    });

    if (!review) {
        throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");
    }

    if (review.userId !== userId) {
        throw new AppError(
            "You can only delete your own reviews",
            403,
            "FORBIDDEN"
        );
    }

    await prisma.review.delete({ where: { id: reviewId } });
};