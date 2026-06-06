"use client";

import Link from "next/link";
import { useAdminProducts } from "@/features/admin/hooks/use-admin-products";

export default function AdminProductsPage() {
    const {
        productsData,
        pendingProductsData,
        isLoadingProducts,
    } = useAdminProducts();

    if (isLoadingProducts) {
        return (
            <div className="p-6">
                Loading products...
            </div>
        );
    }

    if (!productsData?.data?.length) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Products
                        </h1>

                        <p className="text-muted-foreground">
                            Manage all marketplace products
                        </p>
                    </div>

                    <Link
                        href="/admin/products/pending"
                        className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Pending Products

                        {pendingProductsData?.results ? (
                            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {pendingProductsData.results}
                            </span>
                        ) : null}
                    </Link>
                </div>

                <div className="rounded-lg border p-10 text-center">
                    No products found.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Products
                    </h1>

                    <p className="text-muted-foreground">
                        Manage all marketplace products
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="rounded-lg border px-4 py-2">
                        <p className="text-xs text-muted-foreground">
                            Total Products
                        </p>

                        <p className="text-lg font-semibold">
                            {productsData.pagination.total}
                        </p>
                    </div>

                    <Link
                        href="/admin/products/pending"
                        className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Pending Products

                        {pendingProductsData?.results ? (
                            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {pendingProductsData.results}
                            </span>
                        ) : null}
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Vendor</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Stock</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productsData.data.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b hover:bg-muted/30"
                            >
                                <td className="p-3">
                                    <img
                                        src={
                                            product.images?.[0] ||
                                            "/placeholder.png"
                                        }
                                        alt={product.name}
                                        className="h-12 w-12 rounded-md object-cover"
                                    />
                                </td>

                                <td className="p-3 font-medium">
                                    {product.name}
                                </td>

                                <td className="p-3">
                                    {product.vendor?.storeName ?? "-"}
                                </td>

                                <td className="p-3">
                                    {product.category?.name ?? "-"}
                                </td>

                                <td className="p-3">
                                    ₹{product.price}
                                </td>

                                <td className="p-3">
                                    {product.stock}
                                </td>

                                <td className="p-3">
                                    {product.isActive ? (
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                            Inactive
                                        </span>
                                    )}
                                </td>

                                <td className="p-3">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="text-sm font-medium text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                {/* <span>
                    Total Products: {productsData.pagination.total}
                </span> */}

                <span>
                    Page {productsData.pagination.page} of{" "}
                    {productsData.pagination.totalPages}
                </span>
            </div>
        </div>
    );
}