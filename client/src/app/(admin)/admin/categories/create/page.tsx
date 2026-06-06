"use client";

import { useRouter } from "next/navigation";

import CategoryForm from "@/features/admin/components/categories/CategoryForm";
import { useAdminCategories } from "@/features/admin/hooks/use-admin-categories";

export default function CreateCategoryPage() {
    const router = useRouter();

    const {
        createCategory,
        isCreating,
    } = useAdminCategories();

    const handleSubmit = async (
        data: {
            name: string;
            description?: string;
        }
    ) => {
        await createCategory(data);

        router.push(
            "/admin/categories"
        );
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Create Category
                </h1>

                <p className="text-muted-foreground">
                    Add a new product category
                </p>
            </div>

            <div className="rounded-lg border p-6">
                <CategoryForm
                    onSubmit={handleSubmit}
                    isLoading={isCreating}
                />
            </div>
        </div>
    );
}