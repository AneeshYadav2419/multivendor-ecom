import { Request, Response } from "express";
import * as wishlistService from "./wishlist.service.js";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";

/**
 * Get user's wishlist.
 */
export const getWishlist = asyncHandler(
    async (req: Request, res: Response) => {
        const wishlist = await wishlistService.getWishlist(
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            data: wishlist,
        });
    }
);

/**
 * Toggle a product in the wishlist (add if absent, remove if present).
 */
export const toggleWishlistItem = asyncHandler(
    async (req: Request, res: Response) => {
        const { productId } = req.body;

        const result = await wishlistService.toggleWishlistItem(
            req.user!.userId,
            productId
        );

        res.status(200).json({
            success: true,
            message: result.added
                ? "Added to wishlist"
                : "Removed from wishlist",
            data: result,
        });
    }
);

/**
 * Explicitly remove a product from the wishlist.
 */
export const removeWishlistItem = asyncHandler(
    async (req: Request, res: Response) => {
        const productId = req.params.productId as string;

        const wishlist = await wishlistService.removeWishlistItem(
            req.user!.userId,
            productId
        );

        res.status(200).json({
            success: true,
            message: "Removed from wishlist",
            data: wishlist,
        });
    }
);
export const mergeWishlist = asyncHandler(
    async (req: Request, res: Response) => {
        const { productIds } = req.body;

        const wishlist = await wishlistService.mergeWishlist(
            req.user!.userId,
            productIds
        );

        res.status(200).json({
            success: true,
            message: "Wishlist synced",
            data: wishlist,
        });
    }
);
