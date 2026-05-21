"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className,
}) => {
  const has = useWishlistStore((s) => s.has(productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <motion.button
      type="button"
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      whileTap={{ scale: 0.85 }}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-md transition-colors hover:bg-slate-900/80",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={has ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors duration-300",
            has ? "fill-rose-500 text-rose-500" : "text-white/90"
          )}
        />
      </motion.div>
    </motion.button>
  );
};
