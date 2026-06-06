"use client";

import { useParams, useRouter } from "next/navigation";

import CategoryForm from "@/features/admin/components/categories/CategoryForm";

import {
    useAdminCategory,
    useAdminCategories,
} from "@/features/admin/hooks/use-admin-categories";

export default function EditCategoryPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const { data, isLoading } =
        useAdminCategory(id);

    const {
        updateCategory,
        isUpdating,
    } = useAdminCategories();

    if (isLoading) {
        return (
            <div className="p-6">
                Loading category...
            </div>
        );
    }

    const category = data?.data;

    if (!category) {
        return (
            <div className="p-6">
                Category not found.
            </div>
        );
    }

    const handleSubmit = async (
        values: {
            name: string;
            description?: string;
        }
    ) => {
        await updateCategory({
            id,
            data: values,
        });

        router.push(
            "/admin/categories"
        );
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Edit Category
                </h1>

                <p className="text-muted-foreground">
                    Update category information
                </p>
            </div>

            <div className="rounded-lg border p-6">
                <CategoryForm
                    defaultValues={{
                        name: category.name,
                        description:
                            category.description ||
                            "",
                    }}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                />
            </div>
        </div>
    );
}