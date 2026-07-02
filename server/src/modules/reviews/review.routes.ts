import { Router } from "express";
import { protect } from "../../common/middlewares/authMiddleware.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";
import * as reviewController from "./review.controller.js";
import { createReviewSchema } from "./review.validation.js";

const router = Router();

/**
 * @route   GET /api/reviews/:productId
 * @desc    Get all reviews for a product
 * @access  Public
 */
router.get("/:productId", reviewController.getProductReviews);

/**
 * @route   POST /api/reviews/:productId
 * @desc    Submit a review for a product
 * @access  Private
 */
router.post(
    "/:productId",
    protect,
    validate(createReviewSchema),
    reviewController.createReview
);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete own review
 * @access  Private
 */
router.delete("/:reviewId", protect, reviewController.deleteReview);

export default router;