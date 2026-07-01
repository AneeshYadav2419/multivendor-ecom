"use client";

import Link from "next/link";

import CategoryTable from "@/features/admin/components/categories/CategoryTable";
import { useAdminCategories } from "@/features/admin/hooks/use-admin-categories";

export default function CategoriesPage() {
    const {
        categoriesData,
        isLoadingCategories,
        deleteCategory,
    } = useAdminCategories();

    if (isLoadingCategories) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Categories
                    </h1>

                    <p className="text-muted-foreground">
                        Manage product categories
                    </p>
                </div>

                <Link
                    href="/admin/categories/create"
                    className="rounded-md bg-black px-4 py-2 text-white"
                >
                    Create Category
                </Link>
            </div>

            <CategoryTable
                categories={
                    (categoriesData?.data || []).map((c) => ({
                        ...c,
                        description: c.description ?? null,
                    }))
                }
                onDelete={deleteCategory}
            />
        </div>
    );
}