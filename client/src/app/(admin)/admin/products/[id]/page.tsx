// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";

// import { useAdminProduct } from "@/features/admin/hooks/use-admin-products";

// export default function ProductDetailPage() {
//     const params = useParams();

//     const id = params.id as string;

//     const { data, isLoading } = useAdminProduct(id);

//     if (isLoading) {
//         return (
//             <div className="p-6">
//                 Loading product...
//             </div>
//         );
//     }

//     const product = data?.data;

//     if (!product) {
//         return (
//             <div className="p-6">
//                 Product not found.
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 p-6">
//             <Link
//                 href="/admin/products"
//                 className="text-sm text-blue-600 hover:underline"
//             >
//                 ← Back to Products
//             </Link>

//             <div>
//                 <h1 className="text-3xl font-bold">
//                     {product.name}
//                 </h1>

//                 <p className="text-muted-foreground">
//                     Product Details
//                 </p>
//             </div>

//             <div className="grid gap-6 md:grid-cols-2">
//                 {/* Product Image */}
//                 <div>
//                     <img
//                         src={
//                             product.images?.[0] ||
//                             "/placeholder.png"
//                         }
//                         alt={product.name}
//                         className="w-full rounded-lg border"
//                     />
//                 </div>

//                 {/* Product Info */}
//                 <div className="space-y-4">
//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Product Name
//                         </p>

//                         <p className="font-medium">
//                             {product.name}
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Price
//                         </p>

//                         <p className="font-medium">
//                             ₹{product.price}
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Stock
//                         </p>

//                         <p className="font-medium">
//                             {product.stock}
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Vendor
//                         </p>

//                         <p className="font-medium">
//                             {product.vendor?.storeName ?? "-"}
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Category
//                         </p>

//                         <p className="font-medium">
//                             {product.category?.name ?? "-"}
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Status
//                         </p>

//                         <p className="font-medium">
//                             <span
//                                 className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${product.isActive
//                                     ? "bg-green-100 text-green-700"
//                                     : "bg-red-100 text-red-700"
//                                     }`}
//                             >
//                                 {product.isActive ? "Active" : "Inactive"}
//                             </span>
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             <div className="rounded-lg border p-4">
//                 <h2 className="mb-2 font-semibold">
//                     Description
//                 </h2>

//                 <p>
//                     {product.description}
//                 </p>
//             </div>
//         </div>
//     );
// }
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useAdminProduct } from "@/features/admin/hooks/use-admin-products";
import { useAdminProductActions } from "@/features/admin/hooks/use-admin-product-actions";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading } = useAdminProduct(id);

    const {
        approveProduct,
        rejectProduct,
        isApproving,
        isRejecting,
    } = useAdminProductActions();

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
            {/* Back */}
            <Link
                href="/admin/products"
                className="text-sm text-blue-600 hover:underline"
            >
                ← Back to Products
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-muted-foreground">
                        Product Details
                    </p>
                </div>

                <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {product.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Price
                    </p>

                    <p className="text-xl font-bold">
                        ₹{product.price}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Stock
                    </p>

                    <p className="text-xl font-bold">
                        {product.stock}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Vendor
                    </p>

                    <p className="font-semibold">
                        {product.vendor?.storeName ?? "-"}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Category
                    </p>

                    <p className="font-semibold">
                        {product.category?.name ?? "-"}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Images */}
                <div className="space-y-4">
                    <img
                        src={
                            product.images?.[0] ||
                            "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full rounded-lg border"
                    />

                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images?.map((image:string, index:number) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.name}-${index}`}
                                    className="h-20 w-full rounded border object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div className="rounded-lg border p-5">
                        <h2 className="mb-4 font-semibold">
                            Product Information
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Product Name
                                </p>

                                <p>{product.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Slug
                                </p>

                                <p>{product.slug}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Product ID
                                </p>

                                <p className="break-all">
                                    {product.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-5">
                        <h2 className="mb-4 font-semibold">
                            Product Metadata
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <span className="text-muted-foreground">
                                    Created:
                                </span>{" "}
                                {new Date(
                                    product.createdAt
                                ).toLocaleDateString()}
                            </div>

                            <div>
                                <span className="text-muted-foreground">
                                    Updated:
                                </span>{" "}
                                {new Date(
                                    product.updatedAt
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border p-6">
                <h2 className="mb-3 text-lg font-semibold">
                    Description
                </h2>

                <p className="leading-relaxed text-muted-foreground">
                    {product.description}
                </p>
            </div>

            {/* Admin Actions */}
            <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Admin Actions
                </h2>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() =>
                            approveProduct(product.id)
                        }
                        disabled={isApproving}
                        className="rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isApproving
                            ? "Approving..."
                            : "Approve Product"}
                    </button>

                    <button
                        onClick={() =>
                            rejectProduct(product.id)
                        }
                        disabled={isRejecting}
                        className="rounded-md bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isRejecting
                            ? "Rejecting..."
                            : "Reject Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}