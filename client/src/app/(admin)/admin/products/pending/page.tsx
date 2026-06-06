"use client";

import { useAdminProducts } from "@/features/admin/hooks/use-admin-products";
import { useAdminProductActions } from "@/features/admin/hooks/use-admin-product-actions";

export default function PendingProductsPage() {
    const {
        pendingProductsData,
        isLoadingPending,
    } = useAdminProducts();

    const {
        approveProduct,
        rejectProduct,
        isApproving,
        isRejecting,
    } = useAdminProductActions();

    if (isLoadingPending) {
        return (
            <div className="p-6">
                Loading pending products...
            </div>
        );
    }

    if (!pendingProductsData?.data?.length) {
        return (
            <div className="p-6">
                No pending products found.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Pending Products
                </h1>

                <p className="text-muted-foreground">
                    Review and approve vendor products
                </p>
            </div>

            <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Vendor</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Stock</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pendingProductsData.data.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b"
                            >
                                <td className="p-3">
                                    <img
                                        src={
                                            product.images?.[0] ||
                                            "/placeholder.png"
                                        }
                                        alt={product.name}
                                        className="h-12 w-12 rounded object-cover"
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
                                    <div className="flex gap-2">
                                        <button
                                            disabled={isApproving}
                                            onClick={() =>
                                                approveProduct(product.id)
                                            }
                                            className="rounded bg-green-600 px-3 py-1 text-white"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            disabled={isRejecting}
                                            onClick={() =>
                                                rejectProduct(product.id)
                                            }
                                            className="rounded bg-red-600 px-3 py-1 text-white"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-muted-foreground">
                Pending Products: {pendingProductsData.results}
            </div>
        </div>
    );
}