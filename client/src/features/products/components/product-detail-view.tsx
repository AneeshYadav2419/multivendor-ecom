"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, 
  Tag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  BarChart3, 
  ChevronRight,
  Shield,
  Star
} from "lucide-react";
import { Product } from "../types";
import { ProductGallery } from "./product-gallery";
import { ProductReviews } from "./product-reviews";
import { RelatedProducts } from "./related-products";
import { VendorInfoCard } from "./vendor-info-card";
import { ProductPurchasePanel } from "./product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const outOfStock = product.stock === 0;

  return (
    <main className="min-h-screen bg-[#020617] px-4 pb-24 pt-6 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500"
        >
          <Link href="/" className="transition hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4 text-slate-700" />
          <Link href="/products" className="transition hover:text-white">Explore</Link>
          <ChevronRight className="h-4 w-4 text-slate-700" />
          <Link href={`/products?category=${product.category?.name}`} className="transition hover:text-white">{product.category?.name}</Link>
          <ChevronRight className="h-4 w-4 text-slate-700" />
          <span className="max-w-[200px] truncate text-slate-300 sm:max-w-none">{product.name}</span>
        </motion.nav>

        {/* Main Product Section */}
        <div className="grid gap-12 lg:grid-cols-2 xl:gap-24">
          
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <ProductGallery images={product.images} productName={product.name} />
          </motion.div>

          {/* Right: Product Info & Purchase Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:py-6"
          >
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {product.category?.name && (
                <Badge className="bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 px-3 py-1">
                  {product.category.name}
                </Badge>
              )}
              {outOfStock ? (
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">Sold out</Badge>
              ) : (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">In stock</Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
              {product.vendor?.storeName}
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-[1.1]">
              {product.name}
            </h1>

            {/* Quick rating summary mock */}
            <div className="mt-4 flex items-center gap-4 border-b border-white/5 pb-8">
               <div className="flex items-center gap-1">
                 {[1,2,3,4,5].map(i => <Star key={i} className={cn("h-4 w-4", i <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-700 fill-slate-700")} />)}
               </div>
               <span className="text-sm font-medium text-slate-400 hover:text-indigo-400 cursor-pointer transition">124 Reviews</span>
            </div>

            <div className="mt-8">
              <ProductPurchasePanel product={product} />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Truck, label: "Fast & Free Delivery", sub: "On orders over ₹10k", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: ShieldCheck, label: "Secure Checkout", sub: "256-bit encryption", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { icon: RotateCcw, label: "Easy Returns", sub: "7-day no questions", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
              ].map(({ icon: Icon, label, sub, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center sm:items-start rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm transition-colors hover:bg-slate-900/60"
                >
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mb-3", bg, color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-white text-center sm:text-left">{label}</p>
                  <p className="mt-1 text-xs text-slate-400 text-center sm:text-left">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <Separator className="my-20 bg-white/5" />

        {/* Product details + vendor */}
        <section className="grid gap-12 lg:grid-cols-3 xl:gap-24">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-indigo-400" /> Technical Specifications
              </h2>
              
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-md">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-white/5">
                    {[
                      { icon: Tag, label: "Category", value: product.category?.name ?? "—" },
                      { icon: Package, label: "Availability", value: outOfStock ? "Out of stock" : `${product.stock} units` },
                      { icon: Tag, label: "Product ID", value: product.id },
                    ].map((row, idx) => (
                      <tr key={row.label} className={cn("transition-colors hover:bg-white/[0.02]", idx % 2 === 0 ? "bg-slate-900/20" : "")}>
                        <td className="px-6 py-4 text-slate-400 w-1/3">
                          <span className="flex items-center gap-3 font-medium">
                            <row.icon className="h-4 w-4 opacity-70" />
                            {row.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-200">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent p-8">
               <h3 className="text-lg font-bold text-white mb-2">Why buy from AuraMarket?</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 We carefully vet all our vendors to ensure you receive only authentic, high-quality products. Your payment is held securely until your order is delivered.
               </p>
               <div className="flex gap-4">
                 <Shield className="h-8 w-8 text-indigo-400" />
                 <Truck className="h-8 w-8 text-indigo-400" />
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-[-1rem]">About the Seller</h2>
            <VendorInfoCard product={product} />
          </div>
        </section>

        <Separator className="my-20 bg-white/5" />

        <div className="space-y-24">
          <ProductReviews productName={product.name} />
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.categoryId}
          />
        </div>
      </div>
    </main>
  );
};
