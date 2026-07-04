"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/axios";
import { Check, Package, ArrowRight, MapPin, Calendar, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/features/products/lib/format-price";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  paymentId: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
};

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      // For this SaaS UI demonstration, if there's no orderId but we reached success,
      // we might want to fetch the most recent order.
      // But adhering to the existing logic, we require orderId.
      if (!orderId) {
        // Fallback for immediate redirect success without query params
        // We will just show a generic success state for the demo if no order ID is present
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (err: any) {
        setError("We couldn't load your order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <SuccessSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 selection:bg-indigo-500/30">
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-10 text-center max-w-md backdrop-blur-xl">
          <h2 className="text-white text-2xl font-bold mb-3">Something went wrong</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Button onClick={() => router.push("/orders")} className="bg-white text-slate-900 font-semibold rounded-full px-8 h-12 w-full hover:bg-slate-200">
            Go to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Calculate an estimated delivery date (e.g. 5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Animated Checkmark */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Thank you for your purchase. We&apos;ve sent a confirmation email to you with the order details.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl mb-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
             
             {/* Left Col: Info */}
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Receipt className="h-5 w-5 text-indigo-400" /> Order Details
                </h3>
                
                <div className="space-y-4">
                   <div className="flex flex-col">
                      <span className="text-sm text-slate-500 mb-1">Order ID</span>
                      <span className="font-mono text-white bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                         {order?.id || "ORD-" + Math.floor(Math.random() * 1000000)}
                      </span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm text-slate-500 mb-1">Payment Status</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        {order?.paymentStatus || "PAID"}
                      </span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm text-slate-500 mb-1">Amount Paid</span>
                      <span className="text-2xl font-bold text-white">
                         {order?.totalAmount ? formatPrice(order.totalAmount) : "₹0.00"}
                      </span>
                   </div>
                </div>
             </div>

             {/* Right Col: Delivery */}
             <div className="space-y-6 rounded-2xl bg-slate-950/30 p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <MapPin className="h-5 w-5 text-indigo-400" /> Delivery Estimate
                </h3>
                
                <div className="flex items-start gap-4">
                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Calendar className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-white font-medium mb-1">Arrives by {formattedDate}</p>
                      <p className="text-sm text-slate-400">Standard Shipping</p>
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                   <p className="text-sm text-slate-400 mb-2">Order Status:</p>
                   <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                      <div className="bg-indigo-500 h-2 rounded-full w-1/3" />
                   </div>
                   <p className="text-xs text-indigo-400 font-medium">Processing</p>
                </div>
             </div>

          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <Button asChild className="h-14 rounded-full bg-white text-slate-900 font-semibold px-8 hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             <Link href="/products">Continue Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="h-14 rounded-full border-white/10 bg-slate-900/50 text-white font-semibold px-8 hover:bg-slate-800 backdrop-blur-sm">
             <Link href={order ? `/orders/${order.id}` : "/orders"}><Package className="mr-2 h-4 w-4" /> View My Orders</Link>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}

function SuccessSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="animate-pulse w-full max-w-2xl flex flex-col items-center">
        <div className="h-24 w-24 bg-slate-800/50 rounded-full mb-8" />
        <div className="h-10 bg-slate-800/50 rounded w-64 mb-4" />
        <div className="h-6 bg-slate-800/50 rounded w-96 mb-12" />
        
        <div className="w-full bg-slate-900/40 border border-white/5 rounded-3xl p-8 grid gap-8 md:grid-cols-2">
           <div className="space-y-4">
             <div className="h-6 bg-slate-800/50 rounded w-32 mb-6" />
             <div className="h-12 bg-slate-800/50 rounded w-full" />
             <div className="h-12 bg-slate-800/50 rounded w-full" />
             <div className="h-12 bg-slate-800/50 rounded w-full" />
           </div>
           <div className="space-y-4">
             <div className="h-full bg-slate-800/50 rounded-2xl w-full" />
           </div>
        </div>
      </div>
    </div>
  );
}