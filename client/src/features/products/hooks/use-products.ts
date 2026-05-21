import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { ProductQueryParams } from "../types";

export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductQueryParams) => [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
};
