"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { api } from "@/lib/api/axios";
import { motion } from "framer-motion";
import { formatPrice } from "@/features/products/lib/format-price";

export default function CheckoutPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Securing connection...");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const orderAmount = localStorage.getItem("orderAmount");
    if (orderAmount) {
      setAmount(Number(orderAmount));
    }
  }, []);

  useEffect(() => {
    async function initPayment() {
      try {
        console.log("========== CHECKOUT ==========");

        const dbOrderId = localStorage.getItem("dbOrderId");
        const orderAmount = localStorage.getItem("orderAmount");

        if (!dbOrderId || !orderAmount) {
          alert("Order details not found. Returning to shipping.");
          router.push("/shipping");
          return;
        }

        if (!(window as any).Razorpay) {
          alert("Razorpay SDK not loaded");
          router.push("/shipping");
          return;
        }

        setStatusText("Creating secure payment session...");

        // CREATE RAZORPAY ORDER
        const res = await api.post("/payments/create-order", {
          amount: Number(orderAmount),
        });

        const data = res.data;

        if (!data?.order?.id) {
          alert("Payment gateway initialization failed");
          router.push("/shipping");
          return;
        }

        setStatusText("Awaiting payment completion...");

        // OPEN RAZORPAY
        const options = {
          key: data.razorpayKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "AuraMarket",
          description: "Secure Order Payment",
          order_id: data.order.id,

          handler: async function (response: any) {
            try {
              setStatusText("Verifying payment...");
              
              const verifyRes = await api.post("/payments/verify", {
                orderId: dbOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                setStatusText("Payment successful! Redirecting...");
                localStorage.removeItem("dbOrderId");
                localStorage.removeItem("orderAmount");
                setTimeout(() => router.push("/success"), 500);
              } else {
                alert("Payment verification failed");
                router.push("/shipping");
              }
            } catch (err: any) {
              console.error("VERIFY ERROR =", err);
              alert(err?.response?.data?.message || "Payment verification failed");
              router.push("/shipping");
            }
          },

          theme: {
            color: "#4f46e5", // Indigo 600
          },
          modal: {
            ondismiss: function() {
              setStatusText("Payment cancelled.");
              setTimeout(() => router.push("/shipping"), 1000);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);

        rzp.on("payment.failed", function (response: any) {
          console.error("PAYMENT FAILED =", response);
          alert("Payment Failed");
          router.push("/shipping");
        });

        // Add slight delay for UI polish
        setTimeout(() => {
          rzp.open();
          setLoading(false);
        }, 1500);

      } catch (err: any) {
        console.error("CHECKOUT ERROR =", err);
        alert(err?.response?.data?.message || "Unable to initialize payment");
        router.push("/shipping");
      }
    }

    initPayment();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#020617] selection:bg-indigo-500/30">
      
      {/* Top Navbar specifically for Checkout */}
      <div className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-white tracking-tight">AuraMarket</span>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
             <span className="text-white flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cart</span>
             <ChevronRight className="h-4 w-4" />
             <span className="text-white flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Information</span>
             <ChevronRight className="h-4 w-4" />
             <span className="text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-1">Payment</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-32 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/50 p-10 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 relative flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10">
               <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
               <Lock className="h-10 w-10 text-indigo-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Secure Checkout</h1>
            
            {amount && (
              <p className="text-3xl font-extrabold text-white my-6">
                {formatPrice(amount)}
              </p>
            )}

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/50 border border-white/5 mb-8">
               <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
               <span className="text-sm font-medium text-slate-300">{statusText}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Payments are 256-bit SSL encrypted.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}