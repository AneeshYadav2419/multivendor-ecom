
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Loader2, PackageX } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { getWishlist, removeWishlistItem } from "@/lib/api/wishlist.api";
import { Wishlist, WishlistItem } from "@/features/wishlist/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WishlistPage: React.FC = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const isLoggedIn = !!accessToken;

    const localIds = useWishlistStore((state) => state.ids);
    const toggle = useWishlistStore((state) => state.toggle);

    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchWishlist = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getWishlist();
            setWishlist(data);
        } catch {
            toast.error("Couldn't load your wishlist. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchWishlist();
        } else {
            // Guest mode — no product details available locally, only ids.
            // Stop the loading state since there's no fetch to wait for.
            setIsLoading(false);
        }
    }, [isLoggedIn, fetchWishlist]);

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        try {
            if (isLoggedIn) {
                await removeWishlistItem(productId);
                setWishlist((prev) =>
                    prev
                        ? {
                            ...prev,
                            items: prev.items.filter((item) => item.productId !== productId),
                            totalItems: prev.totalItems - 1,
                        }
                        : prev
                );
            } else {
                await toggle(productId);
            }
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Couldn't remove item. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };

    // ── Loading state ──
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
            </div>
        );
    }

    // ── Guest mode (logged out) ──
    if (!isLoggedIn) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/60 border border-slate-800">
                    <Heart className="h-7 w-7 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                    {localIds.length > 0
                        ? `${localIds.length} item${localIds.length > 1 ? "s" : ""} saved on this device`
                        : "Your wishlist is empty"}
                </h1>
                <p className="mt-2 text-slate-400">
                    Sign in to view full details, and to keep your wishlist synced across all your devices.
                </p>
                <div className="mt-6">
                    <Link href="/login?redirect=/wishlist">
                        <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg">
                            Sign in to continue
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const items = wishlist?.items ?? [];

    // ── Empty state (logged in, zero items) ──
    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/60 border border-slate-800">
                    <PackageX className="h-7 w-7 text-slate-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">Your wishlist is empty</h1>
                <p className="mt-2 text-slate-400">
                    Items you save will show up here. Start exploring to find something you love.
                </p>
                <div className="mt-6">
                    <Link href="/products">
                        <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg">
                            Browse products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ── Populated state ──
    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My wishlist</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        {wishlist?.totalItems} item{wishlist?.totalItems !== 1 ? "s" : ""} saved
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <WishlistCard
                            key={item.id}
                            item={item}
                            isRemoving={removingId === item.productId}
                            onRemove={() => handleRemove(item.productId)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

interface WishlistCardProps {
    item: WishlistItem;
    isRemoving: boolean;
    onRemove: () => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ item, isRemoving, onRemove }) => {
    const { product } = item;
    const isOutOfStock = product.stock === 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group relative overflow-hidden border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
                <button
                    onClick={onRemove}
                    disabled={isRemoving}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-slate-400 backdrop-blur-sm transition-colors hover:text-rose-400 disabled:opacity-50"
                >
                    {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </button>

                <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-950/40">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-700">
                                <ShoppingBag className="h-10 w-10" />
                            </div>
                        )}
                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                                <span className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                                    Out of stock
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <p className="text-xs font-medium text-indigo-300/70">
                            {product.category.name}
                        </p>
                        <h3 className="mt-1 truncate text-sm font-semibold text-white">
                            {product.name}
                        </h3>
                        <p className="mt-2 text-base font-bold text-white">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                    </div>
                </Link>
            </Card>
        </motion.div>
    );
};

export default WishlistPage;