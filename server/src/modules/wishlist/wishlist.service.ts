import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";

/**
 * Get the user's wishlist with full product details.
 * Auto-returns an empty shape if no wishlist exists yet (no row created on read).
 */
export const getWishlist = async (userId: string) => {
    const wishlist = await prisma.wishlist.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!wishlist) {
        return {
            items: [],
            totalItems: 0,
        };
    }

    return {
        id: wishlist.id,
        items: wishlist.items,
        totalItems: wishlist.items.length,
    };
};

/**
 * Toggle a product in the user's wishlist.
 * Adds it if absent, removes it if present.
 * Auto-creates the wishlist row on first use, same pattern as Cart.
 *
 * Returns { added: boolean } so the frontend's toggle() can match the
 * Zustand store's existing return contract (exists/added boolean).
 */
export const toggleWishlistItem = async (
    userId: string,
    productId: string
) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });

    if (!product) {
        throw new AppError(
            "Product not found",
            404,
            "PRODUCT_NOT_FOUND"
        );
    }

    let wishlist = await prisma.wishlist.findUnique({
        where: { userId },
    });

    if (!wishlist) {
        wishlist = await prisma.wishlist.create({
            data: { userId },
        });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
        where: {
            wishlistId_productId: {
                wishlistId: wishlist.id,
                productId,
            },
        },
    });

    if (existingItem) {
        await prisma.wishlistItem.delete({
            where: { id: existingItem.id },
        });

        return { added: false };
    }

    await prisma.wishlistItem.create({
        data: {
            wishlistId: wishlist.id,
            productId,
        },
    });

    return { added: true };
};

/**
 * Explicitly remove a product from the wishlist (idempotent — no error if absent).
 */
export const removeWishlistItem = async (
    userId: string,
    productId: string
) => {
    const wishlist = await prisma.wishlist.findUnique({
        where: { userId },
    });

    if (!wishlist) {
        return getWishlist(userId);
    }

    await prisma.wishlistItem.deleteMany({
        where: {
            wishlistId: wishlist.id,
            productId,
        },
    });

    return getWishlist(userId);
};

export const mergeWishlist = async (
    userId: string,
    productIds: string[]
) => {
    if (productIds.length === 0) {
        return getWishlist(userId);
    }

    // Only merge ids that correspond to real, still-existing products
    const validProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true },
    });
    const validIds = validProducts.map((p) => p.id);

    if (validIds.length === 0) {
        return getWishlist(userId);
    }

    let wishlist = await prisma.wishlist.findUnique({
        where: { userId },
    });

    if (!wishlist) {
        wishlist = await prisma.wishlist.create({
            data: { userId },
        });
    }

    // createMany + skipDuplicates handles the union in one query —
    // ids already in the server wishlist are silently skipped via the
    // @@unique([wishlistId, productId]) constraint, no need to diff manually
    await prisma.wishlistItem.createMany({
        data: validIds.map((productId) => ({
            wishlistId: wishlist!.id,
            productId,
        })),
        skipDuplicates: true,
    });

    return getWishlist(userId);
};