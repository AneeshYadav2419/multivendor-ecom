// import { Request, Response } from "express";
// import * as cartService from "./cart.service.js";
// import { asyncHandler } from "../../common/middlewares/asyncHandler.js";

// /**
//  * Get user's cart.
//  */
// export const getCart = asyncHandler(
//     async (req: Request, res: Response) => {
//         const cart = await cartService.getCart(req.user!.userId);

//         res.status(200).json({
//             success: true,
//             data: cart,
//         });
//     }
// );

// /**
//  * Add item to cart.
//  */
// export const addToCart = asyncHandler(
//     async (req: Request, res: Response) => {
//         const cart = await cartService.addToCart(
//             req.user!.userId,
//             req.body
//         );

//         res.status(200).json({
//             success: true,
//             message: "Item added to cart successfully",
//             data: cart,
//         });
//     }
// );
import { Request, Response } from "express";
import * as cartService from "./cart.service.js";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import { UpdateCartItemDTO } from "./cart.types.js";

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

/**
 * Update quantity of a specific cart item.
 */
export const updateCartItem = asyncHandler(
    async (req: Request, res: Response) => {
        const itemId = req.params.itemId as string;
        const { quantity }: UpdateCartItemDTO = req.body;

        const cart = await cartService.updateCartItemQuantity(
            req.user!.userId,
            itemId,
            quantity
        );

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: cart,
        });
    }
);

/**
 * Remove a specific item from the cart.
 */
export const removeCartItem = asyncHandler(
    async (req: Request, res: Response) => {
        const itemId = req.params.itemId as string;

        const cart = await cartService.removeFromCart(
            req.user!.userId,
            itemId
        );

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            data: cart,
        });
    }
);

/**
 * Clear the entire cart.
 */
export const clearCart = asyncHandler(
    async (req: Request, res: Response) => {
        const cart = await cartService.clearCart(req.user!.userId);

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart,
        });
    }
);