"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import {
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Info
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "../hooks/use-cart";
import {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "../hooks/use-cart-mutations";
import { formatPrice } from "@/features/products/lib/format-price";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export const CartView: React.FC = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: cart, isLoading, isError } = useCart();
  const updateItem = useUpdateCartItemMutation();
  const removeItem = useRemoveCartItemMutation();
  const clearCart = useClearCartMutation();

  if (!user || !accessToken) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-[#020617] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-3xl border border-white/10 bg-slate-900/50 p-10 text-center backdrop-blur-xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is waiting</h1>
          <p className="text-slate-400 mb-8">Sign in as a customer to view and manage your shopping bag.</p>
          <Button asChild className="w-full h-12 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-200">
            <Link href="/login?redirect=/cart">Sign in to your account</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  if (user.role !== "CUSTOMER") {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-[#020617] px-4">
        <div className="text-center">
          <p className="text-slate-400 text-lg">
            Shopping cart is available for customer accounts only.
          </p>
          <Button asChild variant="outline" className="mt-6 border-white/10 rounded-full text-white">
            <Link href="/products">Browse Catalog</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mb-12 h-12 w-64 bg-slate-800/50 rounded-lg" />
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-2xl bg-slate-800/50" />
              ))}
            </div>
            <Skeleton className="h-96 w-full rounded-2xl bg-slate-800/50" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-[#020617] px-4 text-center">
        <div className="rounded-xl bg-red-500/10 p-6 border border-red-500/20 max-w-sm">
          <p className="text-red-400">We couldn&apos;t load your cart. Please try refreshing the page.</p>
        </div>
      </main>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.totalAmount ?? 0;
  useEffect(() => {
    setFinalTotal(total);
  }, [total]);

  if (items.length === 0) {
    return (

      <main className="min-h-[80vh] flex items-center justify-center bg-[#020617] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center"
        >
          <div className="relative mx-auto mb-8 h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/5 bg-slate-900/50 shadow-2xl">
              <ShoppingBag className="h-12 w-12 text-slate-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Your cart is empty</h1>
          <p className="mt-4 text-lg text-slate-400 mb-10">
            Looks like you haven&apos;t added anything to your cart yet. Discover amazing products from our trusted vendors.
          </p>
          <Button asChild className="h-14 rounded-full px-8 text-lg font-semibold bg-white text-slate-900 hover:bg-slate-200 transition-all hover:scale-105">
            <Link href="/products">Start Shopping <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-12 pb-28 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl">

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Shopping Cart
            </h1>
            <p className="mt-3 text-slate-400 text-lg">
              {items.length} {items.length !== 1 ? "items" : "item"} in your bag
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full"
            disabled={clearCart.isPending}
            onClick={() => clearCart.mutate()}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
          </Button>
        </motion.header>

        <div className="grid gap-12 lg:grid-cols-12">

          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {items.map((item, index) => {
                const image = item.product.images[0] ?? "/file.svg";
                const price = typeof item.product.price === "string" ? parseFloat(item.product.price) : item.product.price;

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group relative flex flex-col sm:flex-row gap-6 rounded-3xl border border-white/5 bg-slate-900/30 p-4 sm:p-6 backdrop-blur-md transition-all hover:bg-slate-900/50 hover:border-white/10"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.id}`}
                      className="relative h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-950"
                    >
                      <Image src={image} alt={item.product.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, 128px" />
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-lg font-semibold text-white hover:text-indigo-300 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-slate-500 uppercase tracking-widest">{item.product.vendor?.storeName || "AuraMarket"}</p>
                        </div>
                        <p className="font-bold text-lg text-white">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center rounded-full border border-white/10 bg-slate-950/50 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
                            disabled={item.quantity <= 1 || updateItem.isPending}
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-medium text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
                            disabled={item.quantity >= item.product.stock || updateItem.isPending}
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-400">{formatPrice(price)} each</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-full h-8 w-8"
                            disabled={removeItem.isPending}
                            onClick={() => removeItem.mutate(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-900/30 p-8 backdrop-blur-xl shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">Shipping <Info className="w-3 h-3" /></span>
                  <span className="text-emerald-400 font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax</span>
                  <span className="text-white font-medium">₹0.00</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    {/* <Input placeholder="Coupon code" className="pl-9 h-10 bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-indigo-500" /> */}
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="pl-9 h-10 bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-indigo-500"
                    />
                  </div>
                  <Button variant="secondary" className="h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white border-none">
                    Apply
                  </Button>
                </div>
              </div>

              <Separator className="my-6 bg-white/10" />

              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="block text-base font-medium text-slate-300">Total</span>
                  <span className="text-xs text-slate-500">Including all taxes</span>
                </div>
                <span className="text-3xl font-extrabold text-white">{formatPrice(total)}</span>
              </div>

              <Button
                className="group w-full h-14 rounded-2xl bg-white text-lg font-semibold text-slate-950 hover:bg-slate-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                onClick={() => router.push("/shipping")}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Secure SSL encrypted checkout</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
};
