import { api } from "@/lib/api/axios";
import { AddToCartPayload, Cart, CartResponse } from "@/features/cart/types";

export const getCart = async (): Promise<Cart> => {
  const response = await api.get<CartResponse>("/cart");
  return response.data.data;
};

export const addToCart = async (payload: AddToCartPayload): Promise<void> => {
  await api.post("/cart/add", payload);
};

export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<void> => {
  await api.patch(`/cart/item/${itemId}`, { quantity });
};

export const removeCartItem = async (itemId: string): Promise<void> => {
  await api.delete(`/cart/item/${itemId}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete("/cart/clear");
};
