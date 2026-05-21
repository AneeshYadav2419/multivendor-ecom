"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "./product-grid";
import { Badge } from "@/components/ui/badge";

export const ProductsCatalog: React.FC = () => {
  return (
    <main className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <Badge className="mb-4">Curated marketplace</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Designed for how you shop.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              Premium products from verified vendors—crafted with the clarity and
              calm of a modern startup storefront.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-400">
            <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
            <span>Newest first</span>
          </div>
        </motion.header>

        <ProductGrid params={{ limit: 12, sortBy: "newest" }} />
      </div>
    </main>
  );
};
