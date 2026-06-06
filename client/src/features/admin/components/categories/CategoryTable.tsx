"use client";

import Link from "next/link";
import { AdminCategory } from "@/features/admin/types";

interface Props {
    categories: AdminCategory[];
    onDelete: (id: string) => void;
}

export default function CategoryTable({
    categories,
    onDelete,
}: Props) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Slug</th>
                        <th className="p-3 text-left">Created</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="border-b"
                        >
                            <td className="p-3">
                                {category.name}
                            </td>

                            <td className="p-3">
                                {category.slug}
                            </td>

                            <td className="p-3">
                                {new Date(
                                    category.createdAt
                                ).toLocaleDateString()}
                            </td>

                            <td className="p-3">
                                <div className="flex gap-3">
                                    <Link
                                        href={`/admin/categories/edit/${category.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "Delete category?"
                                                )
                                            ) {
                                                onDelete(
                                                    category.id
                                                );
                                            }
                                        }}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}