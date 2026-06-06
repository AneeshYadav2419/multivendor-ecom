import { useQuery } from "@tanstack/react-query";
import {
    getAdminProducts,
    getPendingProducts,
} from "@/lib/api/products.api";
import { getAdminProductById } from "@/lib/api/products.api";

export const useAdminProducts = (params?: any) => {
    const productsQuery = useQuery({
        queryKey: ["admin", "products", params],
        queryFn: () => getAdminProducts(params),
    });

    const pendingProductsQuery = useQuery({
        queryKey: ["admin", "products", "pending"],
        queryFn: getPendingProducts,
    });

    return {
        productsData: productsQuery.data,
        pendingProductsData: pendingProductsQuery.data,

        isLoadingProducts: productsQuery.isLoading,
        isLoadingPending: pendingProductsQuery.isLoading,
    };
};



export const useAdminProduct = (id: string) => {
    return useQuery({
        queryKey: ["admin", "product", id],
        queryFn: () => getAdminProductById(id),
        enabled: !!id,
    });
};