"use client";

import { useState } from "react";

interface CategoryFormProps {
    defaultValues?: {
        name: string;
        description?: string;
    };

    onSubmit: (data: {
        name: string;
        description?: string;
    }) => Promise<void>;

    isLoading?: boolean;
}

export default function CategoryForm({
    defaultValues,
    onSubmit,
    isLoading,
}: CategoryFormProps) {
    const [name, setName] = useState(
        defaultValues?.name || ""
    );

    const [description, setDescription] = useState(
        defaultValues?.description || ""
    );

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        await onSubmit({
            name,
            description,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Category Name
                </label>

                <input
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    required
                    className="w-full rounded-md border p-3"
                    placeholder="Electronics"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(
                            e.target.value
                        )
                    }
                    rows={5}
                    className="w-full rounded-md border p-3"
                    placeholder="Category description..."
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {isLoading
                    ? "Saving..."
                    : "Save Category"}
            </button>
        </form>
    );
}