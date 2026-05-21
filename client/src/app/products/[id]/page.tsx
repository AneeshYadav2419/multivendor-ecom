"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/features/products/hooks/use-product";
import { ProductDetailView } from "@/features/products/components/product-detail-view";
import { ProductDetailSkeleton } from "@/features/products/components/product-detail-skeleton";
import { getApiErrorMessage } from "@/lib/api/get-api-error";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const { data, isLoading, isError, error } = useProduct(productId);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !data?.data) {
    const message = getApiErrorMessage(error, "Product not found.");
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-lg text-slate-300">{message}</p>
        <Button asChild variant="outline" className="border-slate-700">
          <Link href="/products">Back to shop</Link>
        </Button>
      </main>
    );
  }

  return <ProductDetailView product={data.data} />;
}
