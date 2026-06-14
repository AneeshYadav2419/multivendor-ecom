"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVendorOrderById, updateVendorOrderStatus } from "@/lib/api/vendor-orders";
import { 
  X, 
  MapPin, 
  User, 
  Mail, 
  CreditCard, 
  PackageSearch,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderDetailsDrawerProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsDrawer({ orderId, isOpen, onClose }: OrderDetailsDrawerProps) {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendorOrder", orderId],
    queryFn: () => getVendorOrderById(orderId as string),
    enabled: !!orderId && isOpen,
  });

  const orderDetail = data?.data;

  // Sync initial status when data loads
  useEffect(() => {
    if (orderDetail?.fulfillmentStatus) {
      setSelectedStatus(orderDetail.fulfillmentStatus);
    } else if (orderDetail && !orderDetail.fulfillmentStatus) {
      setSelectedStatus("PENDING");
    }
  }, [orderDetail]);

  const updateMutation = useMutation({
    mutationFn: (newStatus: string) => updateVendorOrderStatus(orderId as string, { fulfillmentStatus: newStatus }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendorOrders"] });
      queryClient.invalidateQueries({ queryKey: ["vendorOrder", orderId] });
      toast.success("Order status updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update order status");
    }
  });

  const handleUpdateStatus = () => {
    if (!selectedStatus) return;
    updateMutation.mutate(selectedStatus);
  };

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <>
      {/* OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* DRAWER PANEL */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#090d1f] shadow-2xl border-l border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* DRAWER HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#060a17]/50 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Order Details
              {orderId && <span className="text-sm font-mono text-indigo-400 font-medium">#{orderId.slice(-8).toUpperCase()}</span>}
            </h2>
            {orderDetail && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Placed on {formatDate(orderDetail.createdAt)}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white rounded-full bg-slate-900/50" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-sm text-slate-400">Loading order information...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 bg-red-500/5 rounded-xl border border-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <p className="text-sm text-red-400">Failed to load order details</p>
            </div>
          ) : !orderDetail ? null : (
            <>
              {/* STATUS WIDGET */}
              <div className="bg-[#0b122b] rounded-xl border border-slate-800 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <PackageSearch className="h-4 w-4 text-indigo-400" />
                  Fulfillment Status
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1 w-full relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                      disabled={updateMutation.isPending}
                    >
                      <option value="PENDING">Pending (Awaiting Processing)</option>
                      <option value="PROCESSING">Processing (Packing/Preparing)</option>
                      <option value="SHIPPED">Shipped (On the way)</option>
                      <option value="DELIVERED">Delivered (Completed)</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    {/* Status indicator dot */}
                    <div className={cn(
                      "absolute right-4 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                      selectedStatus === "PENDING" && "bg-slate-400 shadow-slate-400/50",
                      selectedStatus === "PROCESSING" && "bg-blue-400 shadow-blue-400/50",
                      selectedStatus === "SHIPPED" && "bg-amber-400 shadow-amber-400/50",
                      selectedStatus === "DELIVERED" && "bg-emerald-400 shadow-emerald-400/50",
                      selectedStatus === "CANCELLED" && "bg-rose-400 shadow-rose-400/50",
                    )} />
                  </div>
                  
                  <Button 
                    onClick={handleUpdateStatus}
                    disabled={updateMutation.isPending || selectedStatus === (orderDetail.fulfillmentStatus || "PENDING")}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* CUSTOMER & PAYMENT GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b122b] rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-400" />
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Name</p>
                      <p className="text-sm font-medium text-slate-200">{orderDetail.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <p className="text-sm text-slate-300">{orderDetail.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b122b] rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-400" />
                    Payment Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Status</p>
                      <Badge 
                        variant="outline" 
                        className={
                          orderDetail.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          orderDetail.paymentStatus === "FAILED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }
                      >
                        {orderDetail.paymentStatus || "PENDING"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Total Amount</p>
                      <p className="text-lg font-bold text-emerald-400">{formatCurrency(orderDetail.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SHIPPING ADDRESS */}
              <div className="bg-[#0b122b] rounded-xl border border-slate-800 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  Shipping Address
                </h3>
                {orderDetail.shippingAddress ? (
                  <div className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    <p className="font-medium text-slate-200 mb-1">{orderDetail.customerName}</p>
                    <p>{orderDetail.shippingAddress.addressLine1}</p>
                    {orderDetail.shippingAddress.addressLine2 && <p>{orderDetail.shippingAddress.addressLine2}</p>}
                    <p>{orderDetail.shippingAddress.city}, {orderDetail.shippingAddress.state} {orderDetail.shippingAddress.postalCode}</p>
                    <p>{orderDetail.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No shipping address provided.</p>
                )}
              </div>

              {/* ORDER ITEMS */}
              <div className="bg-[#0b122b] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <PackageSearch className="h-4 w-4 text-indigo-400" />
                    Order Items
                  </h3>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                    {orderDetail.orderItems?.length || 0} items
                  </Badge>
                </div>
                
                <div className="divide-y divide-slate-800/60">
                  {orderDetail.orderItems && orderDetail.orderItems.length > 0 ? (
                    orderDetail.orderItems.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-900/20 transition-colors">
                        <div className="h-16 w-16 rounded-md bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-700">
                              <PackageSearch className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-300">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No items found in this order.
                    </div>
                  )}
                </div>
                
                {/* SUBTOTAL SUMMARY */}
                <div className="p-5 bg-slate-900/30 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(orderDetail.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator className="bg-slate-800 my-2" />
                  <div className="flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span className="text-emerald-400">{formatCurrency(orderDetail.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
