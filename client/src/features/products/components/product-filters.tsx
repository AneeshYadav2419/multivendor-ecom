"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  SlidersHorizontal,
  Tag,
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { ProductQueryParams } from "../types";

interface ProductFiltersProps {
  /** Current filter values */
  filters: ProductQueryParams;
  /** Called whenever user changes any filter */
  onChange: (filters: ProductQueryParams) => void;
  /** Whether the panel is open */
  isOpen: boolean;
  /** Close the panel */
  onClose: () => void;
}

const SORT_OPTIONS: { label: string; value: ProductQueryParams["sortBy"] }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

/**
 * Collapsible filter panel for the public product catalog.
 * Controls: Search · Category · Price Range · Sort
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  isOpen,
  onClose,
}) => {
  // Local draft state — applied debounced for text inputs
  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");
  const [minPrice, setMinPrice] = useState(
    filters.minPrice !== undefined ? String(filters.minPrice) : ""
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : ""
  );

  // Sync draft when external filters reset
  useEffect(() => {
    setSearchDraft(filters.search ?? "");
    setMinPrice(filters.minPrice !== undefined ? String(filters.minPrice) : "");
    setMaxPrice(filters.maxPrice !== undefined ? String(filters.maxPrice) : "");
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchDraft || undefined, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  // Fetch categories for the radio list
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.data ?? [];

  const handleCategoryChange = (categoryId: string) => {
    // Toggle off if same category clicked again
    const next = filters.categoryId === categoryId ? undefined : categoryId;
    onChange({ ...filters, categoryId: next, page: 1 });
  };

  const handleSortChange = (sortBy: ProductQueryParams["sortBy"]) => {
    onChange({ ...filters, sortBy, page: 1 });
  };

  const applyPriceRange = useCallback(() => {
    onChange({
      ...filters,
      minPrice: minPrice !== "" ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
      page: 1,
    });
  }, [filters, minPrice, maxPrice, onChange]);

  const clearAll = () => {
    setSearchDraft("");
    setMinPrice("");
    setMaxPrice("");
    onChange({ page: 1, limit: filters.limit, sortBy: "newest" });
  };

  const activeCount = [
    filters.search,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy && filters.sortBy !== "newest" ? filters.sortBy : undefined,
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-in panel */}
          <motion.aside
            key="panel"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 flex h-full w-80 flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 shadow-2xl"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                <span className="font-semibold text-white">Filters</span>
                {activeCount > 0 && (
                  <Badge className="ml-1 h-5 min-w-5 bg-indigo-600 px-1.5 text-[10px] text-white">
                    {activeCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 px-5 py-6">
              {/* ── Search ── */}
              <FilterSection icon={<Search className="h-3.5 w-3.5" />} title="Search">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  />
                  {searchDraft && (
                    <button
                      onClick={() => setSearchDraft("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* ── Sort By ── */}
              <FilterSection icon={<ArrowUpDown className="h-3.5 w-3.5" />} title="Sort By">
                <div className="flex flex-col gap-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                        filters.sortBy === opt.value
                          ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                          : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {opt.label}
                      {filters.sortBy === opt.value && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* ── Category ── */}
              <FilterSection icon={<Tag className="h-3.5 w-3.5" />} title="Category">
                {categories.length === 0 ? (
                  <p className="text-xs text-slate-500">Loading categories…</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                          filters.categoryId === cat.id
                            ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        {cat.name}
                        {filters.categoryId === cat.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </FilterSection>

              {/* ── Price Range ── */}
              <FilterSection
                icon={<ChevronDown className="h-3.5 w-3.5" />}
                title="Price Range (₹)"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-slate-500">—</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={applyPriceRange}
                  className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Apply Price
                </Button>
              </FilterSection>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Reusable collapsible section wrapper ────────────────
const FilterSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="text-indigo-400">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </h3>
    </div>
    {children}
  </div>
);
