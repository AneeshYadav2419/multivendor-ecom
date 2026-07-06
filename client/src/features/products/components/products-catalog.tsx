"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react";
import { ProductGrid } from "./product-grid";
import { ProductFilters } from "./product-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductQueryParams } from "../types";

const DEFAULT_FILTERS: ProductQueryParams = {
  page: 1,
  limit: 12,
  sortBy: "newest",
};

const SORT_LABELS: Record<string, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  price_asc: "Price ↑",
  price_desc: "Price ↓",
};

export const ProductsCatalog: React.FC = () => {
  const [filters, setFilters] = useState<ProductQueryParams>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleFiltersChange = (updated: ProductQueryParams) => {
    setFilters(updated);
  };

  // Count how many non-default filters are active (for badge)
  const activeFilterCount = [
    filters.search,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy && filters.sortBy !== "newest" ? filters.sortBy : undefined,
  ].filter(Boolean).length;

  // Clear a single active filter chip
  const clearFilter = (key: keyof ProductQueryParams) => {
    setFilters((prev) => ({ ...prev, [key]: undefined, page: 1 }));
  };

  // Active filter chips shown under the header
  const chips: { key: keyof ProductQueryParams; label: string }[] = [
    ...(filters.search ? [{ key: "search" as const, label: `"${filters.search}"` }] : []),
    ...(filters.categoryId ? [{ key: "categoryId" as const, label: "Category" }] : []),
    ...(filters.minPrice !== undefined
      ? [{ key: "minPrice" as const, label: `Min ₹${filters.minPrice}` }]
      : []),
    ...(filters.maxPrice !== undefined
      ? [{ key: "maxPrice" as const, label: `Max ₹${filters.maxPrice}` }]
      : []),
  ];

  return (
    <>
      {/* Slide-in filter panel (portal-like, fixed position) */}
      <ProductFilters
        filters={filters}
        onChange={handleFiltersChange}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <main className="relative px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        {/* Ambient SaaS background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* ── HEADER ── */}
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          >
            {/* LEFT */}
            <div className="max-w-2xl">
              <Badge className="mb-4 border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 backdrop-blur-md">
                <Sparkles className="mr-1 h-3 w-3" />
                Curated marketplace
              </Badge>

              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Designed for how you shop.
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                Premium products from verified vendors—built with SaaS-grade
                reliability, speed, and trust.
              </p>

              {/* SaaS micro stats */}
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Live inventory
                </span>
                <span className="flex items-center gap-1">⚡ Fast checkout</span>
                <span className="flex items-center gap-1">🛡 Verified vendors</span>
              </div>
            </div>

            {/* RIGHT — Filter toggle + Sort label */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(true)}
                className="relative border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4 text-indigo-400" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Current sort indicator */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
                <span>{SORT_LABELS[filters.sortBy ?? "newest"]}</span>
              </div>
            </div>
          </motion.header>

          {/* ── ACTIVE FILTER CHIPS ── */}
          {chips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-slate-500">Active filters:</span>
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => clearFilter(chip.key)}
                  className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs text-slate-500 underline underline-offset-2 hover:text-white transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}

          {/* ── PRODUCT GRID ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductGrid
              params={filters}
              onPageChange={(page) =>
                setFilters((prev) => ({ ...prev, page }))
              }
            />
          </motion.div>
        </div>
      </main>
    </>
  );
};