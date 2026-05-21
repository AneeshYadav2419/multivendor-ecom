import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/lib/api/cart";
import { useAuthStore } from "@/store/useAuthStore";

export const cartKeys = {
  all: ["cart"] as const,
  current: () => [...cartKeys.all, "current"] as const,
};

export const useCart = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isCustomer = user?.role === "CUSTOMER" && Boolean(accessToken);

  return useQuery({
    queryKey: cartKeys.current(),
    queryFn: getCart,
    enabled: isCustomer,
    staleTime: 1000 * 30,
  });
};

export const useCartItemCount = (): number => {
  const { data } = useCart();
  if (!data?.items?.length) return 0;
  return data.items.reduce((sum, item) => sum + item.quantity, 0);
};
