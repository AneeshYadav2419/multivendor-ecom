"use client";

import {
    Users,
    Store,
    Package,
    ShoppingCart,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { useAdminDashboard } from "@/features/admin/hooks/use-admin-dashboard";
import Loading from "./loading";

export default function DashboardPage() {
    const { data, isLoading, error } = useAdminDashboard();

    if (isLoading) {
        <Loading />
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
                Failed to load dashboard.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 sm:p-8 text-white">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="relative z-10">
                    <p className="text-indigo-100 text-sm sm:text-base">Welcome back</p>

                    <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">
                        AuraMarket Admin Dashboard
                    </h1>

                    <p className="mt-3 max-w-2xl text-indigo-100 text-sm sm:text-base">
                        Monitor vendors, products, orders and platform performance from one
                        centralized control center.
                    </p>
                </div>
            </div>

            {/* Main KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={data?.totalUsers ?? 0}
                    icon={<Users className="h-5 w-5" />}
                />

                <StatCard
                    title="Total Vendors"
                    value={data?.totalVendors ?? 0}
                    icon={<Store className="h-5 w-5" />}
                />

                <StatCard
                    title="Total Products"
                    value={data?.totalProducts ?? 0}
                    icon={<Package className="h-5 w-5" />}
                />

                <StatCard
                    title="Total Orders"
                    value={data?.totalOrders ?? 0}
                    icon={<ShoppingCart className="h-5 w-5" />}
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm text-muted-foreground">
                            Active Vendors
                        </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">
                        {data?.activeVendors ?? 0}
                    </h2>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <span className="text-sm text-muted-foreground">
                            Pending Vendors
                        </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">
                        {data?.pendingVendors ?? 0}
                    </h2>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm text-muted-foreground">
                            Active Products
                        </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">
                        {data?.activeProducts ?? 0}
                    </h2>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                            Pending Products
                        </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">
                        {data?.pendingProducts ?? 0}
                    </h2>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border bg-card p-6">
                    <h3 className="font-semibold">Vendor Management</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Review and approve vendor registrations.
                    </p>

                    <button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-white">
                        Manage Vendors
                    </button>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <h3 className="font-semibold">Product Moderation</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Approve or reject submitted products.
                    </p>

                    <button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-white">
                        View Products
                    </button>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <h3 className="font-semibold">Category Management</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Create and organize marketplace categories.
                    </p>

                    <button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-white">
                        Manage Categories
                    </button>
                </div>
            </div>
        </div>
    );
}