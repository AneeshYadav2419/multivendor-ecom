"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendorOrders } from "@/lib/api/vendor-orders";
import { Order } from "@/types/order";
import { 
  Search, 
  Filter, 
  Package, 
  DollarSign, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Eye,
  ShoppingBag,
  Calendar
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import OrderDetailsDrawer from "./components/OrderDetailsDrawer";

export default function VendorOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch orders
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendorOrders"],
    queryFn: getVendorOrders,
  });

  const orders = data?.data || [];

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Date formatting helper
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(dateString));
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "ALL" || 
        order.fulfillmentStatus === statusFilter;
        
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchQuery, statusFilter]);

  // Compute stats locally
  const stats = useMemo(() => {
    const total = orders.length;
    let pending = 0, processing = 0, shipped = 0, delivered = 0, cancelled = 0;
    let revenue = 0;
    let todayOrders = 0;
    
    const today = new Date().setHours(0,0,0,0);

    orders.forEach(order => {
      if (order.fulfillmentStatus === "PENDING" || !order.fulfillmentStatus) pending++; // API might not have PENDING, mapped below
      else if (order.fulfillmentStatus === "PROCESSING") processing++;
      else if (order.fulfillmentStatus === "SHIPPED") shipped++;
      else if (order.fulfillmentStatus === "DELIVERED") delivered++;
      else if (order.fulfillmentStatus === "CANCELLED") cancelled++;

      // In this schema, maybe order.totalAmount exists
      if (order.paymentStatus === "PAID" && order.fulfillmentStatus !== "CANCELLED") {
        revenue += order.totalAmount || 0;
      }

      if (new Date(order.createdAt).setHours(0,0,0,0) === today) {
        todayOrders++;
      }
    });

    return { total, pending, processing, shipped, delivered, cancelled, revenue, todayOrders };
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PROCESSING": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "SHIPPED": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "DELIVERED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CANCELLED": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "PENDING":
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#090d1f]/40 p-8 text-center backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
          <XCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Failed to load orders</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-sm">
          There was an error retrieving your orders. Please check your connection or try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your incoming orders and fulfillments.
          </p>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-400" />
            <div className="text-xl font-bold text-white">{stats.total}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Orders</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <div className="text-xl font-bold text-white">{stats.pending}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center gap-2">
            <Package className="h-5 w-5 text-blue-400" />
            <div className="text-xl font-bold text-white">{stats.processing}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Processing</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center gap-2">
            <Truck className="h-5 w-5 text-amber-400" />
            <div className="text-xl font-bold text-white">{stats.shipped}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Shipped</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div className="text-xl font-bold text-white">{stats.delivered}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Delivered</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-gradient-to-br from-[#0b122b] to-[#060a17] hover:border-slate-700 transition-all lg:col-span-2">
          <CardContent className="p-4 flex flex-row items-center justify-between h-full">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Revenue (Paid)</div>
              <div className="text-xl font-bold text-emerald-400">{formatCurrency(stats.revenue)}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by Order ID or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-800 bg-[#060a17]/50 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-[#060a17]/50 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0c1020]">All Statuses</option>
            <option value="PENDING" className="bg-[#0c1020]">Pending</option>
            <option value="PROCESSING" className="bg-[#0c1020]">Processing</option>
            <option value="SHIPPED" className="bg-[#0c1020]">Shipped</option>
            <option value="DELIVERED" className="bg-[#0c1020]">Delivered</option>
            <option value="CANCELLED" className="bg-[#0c1020]">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── ORDERS TABLE ── */}
      <Card className="border-slate-800 bg-[#060a17]/40 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/20 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4">Order Details</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Total</th>
                  <th scope="col" className="px-6 py-4">Payment</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-transparent">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 bg-slate-800" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20 bg-slate-800" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 bg-slate-800 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                        <h4 className="text-base font-semibold text-slate-300">No orders found</h4>
                        <p className="mt-1 text-sm text-slate-500 max-w-sm">
                          {searchQuery || statusFilter !== "ALL" 
                            ? "Try adjusting your search criteria or filters." 
                            : "You don't have any orders yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                          #{order.id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          ID: {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-200">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline" 
                          className={
                            order.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            order.paymentStatus === "FAILED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }
                        >
                          {order.paymentStatus || "PENDING"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={getStatusColor(order.fulfillmentStatus || "PENDING")}>
                          {order.fulfillmentStatus || "PENDING"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8.5 w-8.5 text-slate-400 hover:text-white hover:bg-slate-800/50"
                          title="View Details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── ORDER DETAILS DRAWER ── */}
      <OrderDetailsDrawer 
        orderId={selectedOrderId} 
        isOpen={!!selectedOrderId} 
        onClose={() => setSelectedOrderId(null)} 
      />
    </div>
  );
}
