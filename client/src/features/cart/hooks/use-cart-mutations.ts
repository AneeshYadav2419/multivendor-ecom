import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { addToCart, updateCartItem, removeCartItem, clearCart } from "@/lib/api/cart";
import { AddToCartPayload } from "../types";
import { cartKeys } from "./use-cart";
import { getApiErrorMessage } from "@/lib/api/get-api-error";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, AddToCartPayload>({
    mutationFn: addToCart,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Added to cart", {
        description: `${variables.quantity} item(s) saved to your bag.`,
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not add to cart."));
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, { itemId: string; quantity: number }>({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not update cart."));
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Item removed");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not remove item."));
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, void>({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not clear cart."));
    },
  });
};
