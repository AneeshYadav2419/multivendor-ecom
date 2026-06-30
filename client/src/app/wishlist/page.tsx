"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Loader2, PackageX, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { getWishlist } from "@/lib/api/wishlist.api";
import { Wishlist, WishlistItem } from "@/features/wishlist/types";
import { Button } from "@/components/ui/button";

const WishlistPage: React.FC = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const isLoggedIn = !!accessToken;

    const localIds = useWishlistStore((state) => state.ids);
    const toggle = useWishlistStore((state) => state.toggle);
    const removeFromStore = useWishlistStore((state) => state.remove);

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
            setIsLoading(false);
        }
    }, [isLoggedIn, fetchWishlist]);

    /**
     * Removes through the Zustand store's `remove()` action — not the raw
     * API client directly. This keeps `ids` (used by heart icons everywhere
     * else in the app) in sync with what just got deleted here. Calling the
     * API client directly was the bug: it updated this page's local state
     * but left the store's `ids` stale, so other screens kept showing the
     * old count.
     */
    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        try {
            if (isLoggedIn) {
                await removeFromStore(productId);
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

    if (isLoading) {
        return <WishlistSkeleton />;
    }

    if (!isLoggedIn) {
        return (
            <PageShell>
                <EmptyState
                    icon={<Heart className="h-7 w-7" />}
                    title={
                        localIds.length > 0
                            ? `${localIds.length} item${localIds.length > 1 ? "s" : ""} saved on this device`
                            : "Your wishlist is empty"
                    }
                    description="Sign in to view full product details and keep your wishlist synced across every device."
                    action={
                        <Link href="/login?redirect=/wishlist">
                            <Button className="h-11 px-6 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                                Sign in to continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    }
                />
            </PageShell>
        );
    }

    const items = wishlist?.items ?? [];

    if (items.length === 0) {
        return (
            <PageShell>
                <EmptyState
                    icon={<PackageX className="h-7 w-7" />}
                    title="Your wishlist is empty"
                    description="Items you save will show up here. Start exploring to find something you love."
                    action={
                        <Link href="/products">
                            <Button className="h-11 px-6 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                                Browse products
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    }
                />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                <WishlistHeader totalItems={wishlist?.totalItems ?? 0} />

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
        </PageShell>
    );
};

/* ── Shared page background ── */

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative min-h-screen bg-slate-950">
        <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
                backgroundImage:
                    "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.25), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(217,70,239,0.15), transparent)",
            }}
        />
        <div className="relative">{children}</div>
    </div>
);

/* ── Header strip with stats, SaaS dashboard style ── */

const WishlistHeader: React.FC<{ totalItems: number }> = ({ totalItems }) => (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <Sparkles className="h-3 w-3" />
                Saved for later
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                My wishlist
            </h1>
            <p className="mt-2 text-sm text-slate-400">
                {totalItems} item{totalItems !== 1 ? "s" : ""} you're keeping an eye on
            </p>
        </div>

        <Link href="/products">
            <Button
                variant="outline"
                className="h-10 border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg"
            >
                Continue browsing
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
        </Link>
    </div>
);

/* ── Empty states ── */

const EmptyState: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    action: React.ReactNode;
}> = ({ icon, title, description, action }) => (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-indigo-400 shadow-lg shadow-indigo-500/10"
        >
            {icon}
        </motion.div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-slate-400">{description}</p>
        <div className="mt-7">{action}</div>
    </div>
);

/* ── Loading skeleton ── */

const WishlistSkeleton: React.FC = () => (
    <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <div className="mb-10 space-y-3">
                <div className="h-5 w-32 animate-pulse rounded-full bg-slate-800/60" />
                <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-800/60" />
                <div className="h-4 w-40 animate-pulse rounded-lg bg-slate-800/40" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40"
                    >
                        <div className="aspect-square w-full animate-pulse bg-slate-800/60" />
                        <div className="space-y-2 p-4">
                            <div className="h-3 w-16 animate-pulse rounded bg-slate-800/60" />
                            <div className="h-4 w-32 animate-pulse rounded bg-slate-800/60" />
                            <div className="h-4 w-20 animate-pulse rounded bg-slate-800/60" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </PageShell>
);

/* ── Product card ── */

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
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl transition-shadow duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10"
        >
            <button
                onClick={onRemove}
                disabled={isRemoving}
                aria-label="Remove from wishlist"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-slate-400 backdrop-blur-sm transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
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
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        </motion.div>
    );
};

export default WishlistPage;