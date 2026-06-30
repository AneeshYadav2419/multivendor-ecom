import { api } from "@/lib/api/axios";
import { Wishlist, WishlistResponse, ToggleWishlistResponse } from "@/features/wishlist/types";

export const getWishlist = async (): Promise<Wishlist> => {
    const response = await api.get<WishlistResponse>("/wishlist");
    return response.data.data;
};

export const toggleWishlistItem = async (productId: string): Promise<boolean> => {
    const response = await api.post<ToggleWishlistResponse>("/wishlist/toggle", { productId });
    return response.data.data.added;
};

export const removeWishlistItem = async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/${productId}`);
};

export const mergeWishlist = async (productIds: string[]): Promise<Wishlist> => {
    const response = await api.post<WishlistResponse>("/wishlist/merge", { productIds });
    return response.data.data;
};