import { Request, Response } from "express";
import * as reviewService from "./review.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

/**
 * GET /api/reviews/:productId
 * Public — anyone can read reviews.
 */
export const getProductReviews = catchAsync(
    async (req: Request, res: Response) => {
        const productId = req.params.productId as string;
        const data = await reviewService.getProductReviews(productId);

        res.status(200).json({
            success: true,
            data,
        });
    }
);

/**
 * POST /api/reviews/:productId
 * Private — must be logged in to leave a review.
 */
export const createReview = catchAsync(
    async (req: Request, res: Response) => {
        const productId = req.params.productId as string;

        const review = await reviewService.createReview(
            req.user!.userId,
            productId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: { review },
        });
    }
);

/**
 * DELETE /api/reviews/:reviewId
 * Private — only review author can delete.
 */
export const deleteReview = catchAsync(
    async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId as string;

        await reviewService.deleteReview(req.user!.userId, reviewId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    }
);