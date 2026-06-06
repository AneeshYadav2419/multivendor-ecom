"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useAdminProduct } from "@/features/admin/hooks/use-admin-products";

export default function ProductDetailPage() {
    const params = useParams();

    const id = params.id as string;

    const { data, isLoading } = useAdminProduct(id);

    if (isLoading) {
        return (
            <div className="p-6">
                Loading product...
            </div>
        );
    }

    const product = data?.data;

    if (!product) {
        return (
            <div className="p-6">
                Product not found.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <Link
                href="/admin/products"
                className="text-sm text-blue-600 hover:underline"
            >
                ← Back to Products
            </Link>

            <div>
                <h1 className="text-3xl font-bold">
                    {product.name}
                </h1>

                <p className="text-muted-foreground">
                    Product Details
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Image */}
                <div>
                    <img
                        src={
                            product.images?.[0] ||
                            "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full rounded-lg border"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Product Name
                        </p>

                        <p className="font-medium">
                            {product.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Price
                        </p>

                        <p className="font-medium">
                            ₹{product.price}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Stock
                        </p>

                        <p className="font-medium">
                            {product.stock}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Vendor
                        </p>

                        <p className="font-medium">
                            {product.vendor?.storeName ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Category
                        </p>

                        <p className="font-medium">
                            {product.category?.name ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Status
                        </p>

                        <p className="font-medium">
                            {product.isActive
                                ? "Active"
                                : "Inactive"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border p-4">
                <h2 className="mb-2 font-semibold">
                    Description
                </h2>

                <p>
                    {product.description}
                </p>
            </div>
        </div>
    );
}