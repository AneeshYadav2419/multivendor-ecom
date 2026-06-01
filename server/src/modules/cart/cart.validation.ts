import { z } from "zod";

export const addToCartSchema = z.object({
    body: z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().positive(),
    }),
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().positive(),
    }),
});