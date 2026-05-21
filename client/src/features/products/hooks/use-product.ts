import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/api/products";
import { productKeys } from "./use-products";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
};
