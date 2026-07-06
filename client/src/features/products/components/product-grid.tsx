"use client";

import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../hooks/use-products";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "./product-card-skeleton";
import { ProductQueryParams } from "../types";
import { getApiErrorMessage } from "@/lib/api/get-api-error";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  params?: ProductQueryParams;
  /** Called when the user navigates to another page */
  onPageChange?: (page: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  params,
  onPageChange,
}) => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useProducts(params);

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
  const pagination = data?.pagination;

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
        <p className="text-slate-400">No products match your filters.</p>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting or clearing the active filters.
        </p>
      </div>
    );
  }

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? products.length;

  return (
    <div className="space-y-8">
      {/* Refreshing indicator */}
      {isFetching && !isLoading && (
        <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-600">
          Refreshing…
        </p>
      )}

      {/* Results summary */}
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-300">{products.length}</span>{" "}
        of <span className="font-medium text-slate-300">{total}</span> products
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {/* Page pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                  p === currentPage
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white disabled:opacity-40"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
