"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, MessageCircle, Store } from "lucide-react";
import { Product } from "../types";
import { Button } from "@/components/ui/button";

interface VendorInfoCardProps {
  product: Product;
}

export const VendorInfoCard: React.FC<VendorInfoCardProps> = ({ product }) => {
  const storeName = product.vendor?.storeName ?? "Marketplace Seller";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
          <Store className="h-7 w-7 text-indigo-300" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Sold by
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{storeName}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
            <BadgeCheck className="h-4 w-4" />
            <span>Verified vendor on AuraMarket</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Independent seller with curated inventory. Orders ship directly from
            this vendor&apos;s fulfillment workflow.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-slate-700 text-slate-200"
          asChild
        >
          <Link href="/products">More from this store</Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-400" disabled>
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact seller (soon)
        </Button>
      </div>
    </motion.div>
  );
};
