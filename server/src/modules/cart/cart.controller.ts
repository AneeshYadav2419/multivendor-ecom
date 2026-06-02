import { Request, Response } from "express";
import * as cartService from "./cart.service.js";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";

/**
 * Get user's cart.
 */
export const getCart = asyncHandler(
    async (req: Request, res: Response) => {
        const cart = await cartService.getCart(req.user!.userId);

        res.status(200).json({
            success: true,
            data: cart,
        });
    }
);

/**
 * Add item to cart.
 */
export const addToCart = asyncHandler(
    async (req: Request, res: Response) => {
        const cart = await cartService.addToCart(
            req.user!.userId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart,
        });
    }
);