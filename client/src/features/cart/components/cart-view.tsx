"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-slate-600" />
        <h1 className="mt-4 text-2xl font-semibold text-white">Your cart</h1>
        <p className="mt-2 text-slate-400">Sign in as a customer to view your bag.</p>
        <Button asChild className="mt-6 bg-white text-slate-900">
          <Link href="/login?redirect=/cart">Sign in</Link>
        </Button>
      </main>
    );
  }

  if (user.role !== "CUSTOMER") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-slate-400">
          Shopping cart is available for customer accounts only.
        </p>
        <Button asChild variant="outline" className="mt-6 border-slate-700">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center text-rose-300">
        Failed to load cart. Please try again.
      </main>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.totalAmount ?? 0;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-slate-600" />
        <h1 className="mt-6 text-2xl font-semibold text-white">Your cart is empty</h1>
        <p className="mt-2 text-slate-400">
          Discover products from trusted vendors on AuraMarket.
        </p>
        <Button asChild className="mt-8 bg-white text-slate-900">
          <Link href="/products">Browse products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 pb-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Shopping cart
            </h1>
            <p className="mt-2 text-slate-400">
              {items.length} product line{items.length !== 1 ? "s" : ""} from marketplace vendors
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-rose-400"
            disabled={clearCart.isPending}
            onClick={() => clearCart.mutate()}
          >
            Clear cart
          </Button>
        </motion.header>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, index) => {
              const image = item.product.images[0] ?? "/file.svg";
              const price =
                typeof item.product.price === "string"
                  ? parseFloat(item.product.price)
                  : item.product.price;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 sm:gap-6 sm:p-5"
                >
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-950 sm:h-28 sm:w-28"
                  >
                    <Image src={image} alt={item.product.name} fill className="object-cover" sizes="112px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-semibold text-white hover:text-indigo-300 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-indigo-400/80">{formatPrice(price)} each</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/50">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          onClick={() =>
                            updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                          }
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={
                            item.quantity >= item.product.stock || updateItem.isPending
                          }
                          onClick={() =>
                            updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="font-semibold text-white">
                        {formatPrice(price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-rose-400"
                        disabled={removeItem.isPending}
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6">
              <h2 className="text-lg font-semibold text-white">Order summary</h2>
              <Separator className="my-4 bg-slate-800" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Calculated at checkout</span>
                </div>
              </div>
              <Separator className="my-4 bg-slate-800" />
              <div className="flex justify-between text-base font-semibold">
                <span className="text-white">Estimated total</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <Button
                className="mt-6 h-12 w-full bg-white text-base font-semibold text-slate-900 hover:bg-slate-100"
                onClick={() => router.push("/checkout")}
              >
                Proceed to checkout
              </Button>
              <Button
                variant="ghost"
                asChild
                className="mt-2 w-full text-slate-400"
              >
                <Link href="/products">Continue shopping</Link>
              </Button>
              <p className="mt-4 text-center text-xs text-slate-600">
                Checkout connects to orders API (coming next).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
