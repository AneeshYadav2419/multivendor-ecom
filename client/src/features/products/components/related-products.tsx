"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../hooks/use-products";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { Button } from "@/components/ui/button";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useProducts({
    limit: 12,
    sortBy: "newest",
    categoryId,
  });

  const related =
    data?.data?.filter((p) => p.id !== currentProductId).slice(0, 8) ?? [];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="mt-24 border-t border-slate-800/80 pt-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            You may also like
          </h2>
          <p className="mt-2 text-slate-400">Curated picks from the same collection</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="border-slate-700 bg-slate-900/50 text-slate-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="border-slate-700 bg-slate-900/50 text-slate-300"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 scrollbar-none sm:mx-0 sm:px-0"
        >
          {related.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="w-[260px] shrink-0 snap-start sm:w-[280px]"
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
