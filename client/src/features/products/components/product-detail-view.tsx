"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Tag, Truck, Shield, RotateCcw, BarChart3 } from "lucide-react";
import { Product } from "../types";
import { ProductGallery } from "./product-gallery";
import { ProductReviews } from "./product-reviews";
import { RelatedProducts } from "./related-products";
import { VendorInfoCard } from "./vendor-info-card";
import { ProductPurchasePanel } from "./product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const outOfStock = product.stock === 0;

  return (
    <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-white">
            Shop
          </Link>
          <span>/</span>
          <span className="text-slate-400">{product.category?.name}</span>
          <span>/</span>
          <span className="max-w-[200px] truncate text-slate-300 sm:max-w-none">
            {product.name}
          </span>
        </motion.nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <ProductGallery images={product.images} productName={product.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="flex flex-wrap items-center gap-2">
              {product.category?.name && <Badge>{product.category.name}</Badge>}
              {outOfStock ? (
                <Badge variant="outline">Sold out</Badge>
              ) : (
                <Badge variant="success">In stock</Badge>
              )}
            </div>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400/90">
              {product.vendor?.storeName}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {product.name}
            </h1>

            <ProductPurchasePanel product={product} />

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Truck, label: "Fast delivery", sub: "Multi-vendor shipping" },
                { icon: Shield, label: "Secure checkout", sub: "Encrypted payments" },
                { icon: RotateCcw, label: "Easy returns", sub: "7-day policy" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4"
                >
                  <Icon className="h-5 w-5 text-indigo-400" />
                  <p className="mt-2 text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Product details + vendor */}
        <section className="mt-16 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white">Product details</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800/80">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-800/80">
                  {[
                    { icon: Tag, label: "Category", value: product.category?.name ?? "—" },
                    { icon: Package, label: "Availability", value: outOfStock ? "Out of stock" : `${product.stock} units` },
                    { icon: BarChart3, label: "SKU", value: product.slug },
                    { icon: Tag, label: "Product ID", value: product.id.slice(0, 12) + "…" },
                  ].map((row) => (
                    <tr key={row.label} className="bg-slate-900/20">
                      <td className="px-5 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <row.icon className="h-4 w-4" />
                          {row.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-200">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <VendorInfoCard product={product} />
          </div>
        </section>

        <Separator className="my-16 bg-slate-800" />

        <ProductReviews productName={product.name} />
        <RelatedProducts
          currentProductId={product.id}
          categoryId={product.categoryId}
        />
      </div>
    </main>
  );
};
