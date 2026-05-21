"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "../types";
import { formatPrice } from "../lib/format-price";
import { WishlistButton } from "./wishlist-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { useAddToCartMutation } from "@/features/cart/hooks/use-cart-mutations";

interface ProductPurchasePanelProps {
  product: Product;
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
}) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [quantity, setQuantity] = useState(1);
  const { mutate: addToCart, isPending } = useAddToCartMutation();

  const outOfStock = product.stock === 0;
  const maxQty = Math.min(product.stock, 10);
  const isLoggedIn = Boolean(user && accessToken);
  const isCustomer = user?.role === "CUSTOMER";
  const lineTotal = formatPrice(
    (typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price) * quantity
  );

  const requireCustomerAuth = (): boolean => {
    if (!isLoggedIn) {
      toast.error("Sign in to shop", {
        description: "Create a customer account to add items to your cart.",
        action: {
          label: "Sign in",
          onClick: () =>
            router.push(`/login?redirect=/products/${product.id}`),
        },
      });
      return false;
    }
    if (!isCustomer) {
      toast.error("Customer account required", {
        description: "Vendors and admins cannot use the shopping cart.",
      });
      return false;
    }
    return true;
  };

  const handleAddToCart = (redirectToCart = false) => {
    if (!requireCustomerAuth() || outOfStock) return;

    addToCart(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          if (redirectToCart) router.push("/cart");
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mt-6 flex items-baseline gap-4">
        <p className="text-3xl font-semibold tracking-tight text-white">
          {formatPrice(product.price)}
        </p>
        {!outOfStock && product.stock <= 5 && (
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
            Only {product.stock} left
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Subtotal ({quantity} item{quantity > 1 ? "s" : ""}):{" "}
        <span className="font-medium text-slate-300">{lineTotal}</span>
      </p>

      <p className="mt-6 text-base leading-relaxed text-slate-400">
        {product.description}
      </p>

      <Separator className="my-8 bg-slate-800" />

      {!isLoggedIn && (
        <div className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
          <Link href={`/login?redirect=/products/${product.id}`} className="font-semibold underline">
            Sign in
          </Link>{" "}
          as a customer to add to cart and checkout.
        </div>
      )}

      {isLoggedIn && !isCustomer && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          You&apos;re signed in as <strong>{user?.role}</strong>. Use a customer
          account to purchase from the marketplace.
        </div>
      )}

      {!outOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400">Quantity</span>
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/50">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isPending}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty || isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          disabled={outOfStock || isPending}
          onClick={() => handleAddToCart(false)}
          className="h-12 flex-1 gap-2 bg-white text-base font-semibold text-slate-900 hover:bg-slate-100"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ShoppingBag className="h-5 w-5" />
          )}
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={outOfStock || isPending}
          onClick={() => handleAddToCart(true)}
          className="h-12 flex-1 gap-2 border-indigo-500/50 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20"
        >
          <Zap className="h-5 w-5" />
          Buy now
        </Button>
        <WishlistButton
          productId={product.id}
          className="!h-12 !w-12 shrink-0 border-slate-700"
        />
      </div>
    </div>
  );
};
