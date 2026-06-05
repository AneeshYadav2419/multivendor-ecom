"use client";

import { useState } from "react";
import { useAdminProducts } from "@/features/admin/hooks/use-admin-products";

export default function ProductsPage() {

    const [tab, setTab] =
        useState<"all" | "pending">("all");

    const {
        productsData,
        pendingProductsData,
        isLoadingProducts,

        approveProduct,
        rejectProduct,

        isApproving,
        isRejecting,
    } = useAdminProducts();

    const products = productsData?.data ?? [];
    const pendingProducts = pendingProductsData?.data ?? [];

    return (
        <div>
            Products Page
        </div>
    )
}