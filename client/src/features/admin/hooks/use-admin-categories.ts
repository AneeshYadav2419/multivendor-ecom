"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAdminCategoryById } from "@/lib/api/categories";

import {
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/api/categories";

export const useAdminCategories = () => {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ["admin", "categories"],
        queryFn: getAdminCategories,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,

        onSuccess: () => {
            toast.success("Category created");
            queryClient.invalidateQueries({
                queryKey: ["admin", "categories"],
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: {
                name: string;
                description?: string;
            };
        }) => updateCategory(id, data),

        onSuccess: () => {
            toast.success("Category updated");
            queryClient.invalidateQueries({
                queryKey: ["admin", "categories"],
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,

        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({
                queryKey: ["admin", "categories"],
            });
        },
    });

    return {
        categoriesData: categoriesQuery.data,
        isLoadingCategories: categoriesQuery.isLoading,

        createCategory: createMutation.mutateAsync,
        updateCategory: updateMutation.mutateAsync,
        deleteCategory: deleteMutation.mutateAsync,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
export const useAdminCategory = (id: string) => {
    return useQuery({
        queryKey: ["admin", "category", id],
        queryFn: () => getAdminCategoryById(id),
        enabled: !!id,
    });
};