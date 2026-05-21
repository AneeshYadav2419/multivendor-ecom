"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Product } from "../types";
import { formatPrice } from "../lib/format-price";
import { WishlistButton } from "./wishlist-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const imageUrl = product.images[0] ?? "/file.svg";
  const outOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <article
          className={cn(
            "relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30",
            "transition-all duration-500 ease-out",
            "hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900/50",
            "hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.25)]"
          )}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {product.category?.name && (
                <Badge variant="secondary" className="bg-slate-950/70 backdrop-blur-md">
                  {product.category.name}
                </Badge>
              )}
              {outOfStock && <Badge variant="outline">Sold out</Badge>}
            </div>

            <div className="absolute right-3 top-3 z-10">
              <WishlistButton productId={product.id} />
            </div>

            <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              {product.vendor?.storeName ?? "AuraMarket"}
            </p>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-indigo-100">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="text-lg font-semibold tracking-tight text-white">
                {formatPrice(product.price)}
              </p>
              {!outOfStock && (
                <span className="text-xs text-slate-500">{product.stock} in stock</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};
