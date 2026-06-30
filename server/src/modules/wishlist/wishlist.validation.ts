import { z } from "zod";

export const toggleWishlistSchema = z.object({
    body: z.object({
        productId: z.string().cuid(),
    }),
});
export const mergeWishlistSchema = z.object({
    body: z.object({
        productIds: z.array(z.string().cuid()).max(200),
    }),
});