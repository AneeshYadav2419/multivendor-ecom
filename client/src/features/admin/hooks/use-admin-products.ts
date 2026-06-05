import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    getAdminProducts,
    getPendingProducts,
    approveProduct,
    rejectProduct,
} from "@/lib/api/admin";

import { toast } from "sonner";

export const useAdminProducts = () => {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ["admin", "products"],
        queryFn: getAdminProducts,
    });

    const pendingProductsQuery = useQuery({
        queryKey: ["admin", "products", "pending"],
        queryFn: getPendingProducts,
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => approveProduct(id),

        onSuccess: () => {
            toast.success("Product approved");

            queryClient.invalidateQueries({
                queryKey: ["admin", "products"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "products", "pending"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "dashboard"],
            });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => rejectProduct(id),

        onSuccess: () => {
            toast.success("Product rejected");

            queryClient.invalidateQueries({
                queryKey: ["admin", "products"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "products", "pending"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin", "dashboard"],
            });
        },
    });

    return {
        productsData: productsQuery.data,
        pendingProductsData: pendingProductsQuery.data,

        isLoadingProducts: productsQuery.isLoading,
        isLoadingPending: pendingProductsQuery.isLoading,

        approveProduct: approveMutation.mutateAsync,
        rejectProduct: rejectMutation.mutateAsync,

        isApproving: approveMutation.isPending,
        isRejecting: rejectMutation.isPending,
    };
};