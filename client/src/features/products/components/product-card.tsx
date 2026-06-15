"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, AlertCircle, TrendingDown } from "lucide-react";
import { Product } from "../types";
import { formatPrice } from "../lib/format-price";
import { WishlistButton } from "./wishlist-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryStyles: Record<string, string> = {
  Electronics: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Fashion: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  Beauty: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  Default: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
}) => {
  const imageUrl = product.images?.[0] ?? "/file.svg";
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  
  // Dummy discount logic to showcase the badge for some items
  const hasDiscount = (index % 3) === 0; 
  const originalPrice = hasDiscount ? (product.price * 1.2) : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group h-full"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <article
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10",
            "bg-gradient-to-br from-slate-900/80 to-slate-900/30",
            "backdrop-blur-xl transition-all duration-500 ease-out",
            "hover:-translate-y-2 hover:border-indigo-500/40",
            "hover:shadow-[0_20px_80px_-20px_rgba(99,102,241,0.3)]"
          )}
        >
          {/* IMAGE SECTION */}
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-950 p-2 rounded-t-[2rem]">
            <div className="relative h-full w-full rounded-3xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-1"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-500" />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
            </div>

            {/* TOP BADGES */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.category?.name && (
                <Badge
                  className={cn(
                    "backdrop-blur-xl border font-semibold px-3 py-1 shadow-xl",
                    categoryStyles[product.category?.name] ?? categoryStyles.Default
                  )}
                >
                  {product.category?.name}
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-xl flex items-center gap-1 w-fit shadow-xl">
                  <TrendingDown className="h-3 w-3" />
                  20% OFF
                </Badge>
              )}
            </div>

            <div className="absolute left-4 bottom-4 flex flex-col gap-2 z-10">
              {outOfStock ? (
                <Badge className="bg-red-500/80 text-white border-transparent shadow-xl">
                  Sold out
                </Badge>
              ) : lowStock ? (
                <Badge className="bg-amber-500/80 text-white border-transparent flex items-center gap-1 shadow-xl">
                  <AlertCircle className="h-3 w-3" />
                  Only {product.stock} left
                </Badge>
              ) : null}
            </div>

            {/* WISHLIST */}
            <div className="absolute right-4 top-4 z-10 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <WishlistButton productId={product.id} />
            </div>

            {/* CTA ICON */}
            <div
              className={cn(
                "absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center",
                "rounded-full bg-white text-slate-900 shadow-xl",
                "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
                "transition-all duration-500 ease-out delay-75"
              )}
            >
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 flex-col gap-3 p-6 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400/80">
              {product.vendor?.storeName ?? "AuraMarket"}
            </p>

            <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white group-hover:text-indigo-300 transition-colors duration-300 flex-1">
              {product.name}
            </h3>

            <div className="mt-2 flex items-baseline gap-3">
              <p className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(product.price)}
              </p>
              {hasDiscount && (
                <p className="text-sm font-medium text-slate-500 line-through decoration-slate-600/50">
                  {formatPrice(originalPrice)}
                </p>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};