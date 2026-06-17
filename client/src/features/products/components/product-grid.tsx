"use client";

import { RefreshCw } from "lucide-react";
import { useProducts } from "../hooks/use-products";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "./product-card-skeleton";
import { ProductQueryParams } from "../types";
import { getApiErrorMessage } from "@/lib/api/get-api-error";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  params?: ProductQueryParams;
  
}
interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ params }) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts(params);

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (isError) {
    const message = getApiErrorMessage(error, "Failed to load products.");
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-8 py-12 text-center">
        <p className="text-sm text-rose-300">{message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-rose-500/30 text-rose-200"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  const products = data?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
        <p className="text-slate-400">No products in catalog yet.</p>
        <p className="mt-1 text-sm text-slate-500">Run server seed: npm run db:seed</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isFetching && !isLoading && (
        <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-600">
          Refreshing…
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};
