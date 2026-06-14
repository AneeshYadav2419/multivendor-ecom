"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendorDashboardStats, VendorDashboardStats } from "@/lib/api/vendor";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  ShoppingBag,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const mockChartData = [
  { name: 'Jan', revenue: 45000, orders: 120 },
  { name: 'Feb', revenue: 52000, orders: 145 },
  { name: 'Mar', revenue: 48000, orders: 130 },
  { name: 'Apr', revenue: 61000, orders: 165 },
  { name: 'May', revenue: 59000, orders: 155 },
  { name: 'Jun', revenue: 75000, orders: 190 },
  { name: 'Jul', revenue: 82000, orders: 210 },
];

export default function VendorDashboard() {
  const { user } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["vendorDashboardStats"],
    queryFn: getVendorDashboardStats,
  });

  const stats = data?.data;

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#090d1f]/40 p-8 text-center backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-4 animate-pulse">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Failed to load statistics</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-sm">
          There was an error retrieving your store analytics. Please check your connection or try again.
        </p>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          className="mt-6 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/vendor/products">
            <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-300">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Manage Catalog
            </Button>
          </Link>
          <Link href="/vendor/products/create">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* ── METRICS GRID ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24 bg-slate-800" />
                <Skeleton className="h-4 w-4 rounded-full bg-slate-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 bg-slate-800 mb-1" />
                <Skeleton className="h-3 w-28 bg-slate-800" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {/* Revenue Card */}
            <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Revenue
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {formatCurrency(stats?.revenue ?? 0)}
                </div>
                <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            {/* Orders Card */}
            <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Orders
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {stats?.totalOrders ?? 0}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Lifetime processed orders
                </p>
              </CardContent>
            </Card>

            {/* Total Products Card */}
            <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Products
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <Package className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {stats?.totalProducts ?? 0}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Products in catalog
                </p>
              </CardContent>
            </Card>

            {/* Active Products Card */}
            <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Products
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {stats?.activeProducts ?? 0}
                </div>
                <p className="mt-1 text-[11px] text-emerald-400/80">
                  Visible in public store
                </p>
              </CardContent>
            </Card>

            {/* Pending Products Card */}
            <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending Review
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Clock className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {stats?.pendingProducts ?? 0}
                </div>
                <p className="mt-1 text-[11px] text-amber-400/80">
                  Awaiting admin approval
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* ── WIDGETS SECTION ── */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sales Activity Card */}
        <Card className="md:col-span-2 border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold">Revenue Insights</CardTitle>
            <CardDescription className="text-slate-400">
              Overview of your recent store revenue and sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Tips & Resources */}
        <Card className="border-slate-800 bg-[#060a17]/50 backdrop-blur-md flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold">Vendor Resources</CardTitle>
            <CardDescription className="text-slate-400">
              Guidelines to scale your store.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-800/80 bg-slate-950/30 p-3 hover:border-slate-700 transition-colors">
                <h4 className="text-xs font-semibold text-indigo-400">Improve Search Visibility</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Provide detailed product descriptions, keywords, and accurate product categories.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-slate-950/30 p-3 hover:border-slate-700 transition-colors">
                <h4 className="text-xs font-semibold text-violet-400">Image Recommendations</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Use clear, high-resolution aspect-ratio images to build trust with customers.
                </p>
              </div>
            </div>

            <Link href="/vendor/products/create" className="block w-full">
              <Button className="w-full justify-between bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white">
                Create new listing
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
