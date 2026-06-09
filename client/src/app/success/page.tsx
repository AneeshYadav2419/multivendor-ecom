"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api/axios";
import { CheckCircle2, Loader2, ShoppingBag, Package } from "lucide-react";

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
            if (!orderId) {
                setError("Missing order reference.");
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(`/api/orders/${orderId}`);
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

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-md">
                    <h2 className="text-white text-xl font-semibold mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">{error}</p>

                    <button
                        onClick={() => router.push("/orders")}
                        className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
                    >
                        Go to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">

                {/* Success Icon */}
                <div className="flex justify-center mb-6 animate-pulse">
                    <div className="bg-green-500/10 p-4 rounded-full">
                        <CheckCircle2 className="text-green-400 w-14 h-14" />
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl">

                    <h1 className="text-2xl font-semibold text-white text-center">
                        Payment Successful 🎉
                    </h1>

                    <p className="text-gray-400 text-center mt-2">
                        Your order has been placed successfully and is now processing.
                    </p>

                    {/* Order Details */}
                    <div className="mt-6 space-y-3 text-sm">
                        <Row label="Order ID" value={order.id} />
                        <Row label="Payment ID" value={order.paymentId} />
                        <Row label="Payment Status" value={order.paymentStatus} highlight />
                        <Row label="Order Status" value={order.status} />
                        <Row label="Total Amount" value={`₹${order.totalAmount}`} />
                    </div>

                    {/* Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => router.push("/orders")}
                            className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} /> My Orders
                        </button>

                        <button
                            onClick={() => router.push(`/orders/${order.id}`)}
                            className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2"
                        >
                            <Package size={18} /> Order Details
                        </button>

                        <button
                            onClick={() => router.push("/products")}
                            className="bg-transparent border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- UI ROW ---------- */
function Row({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400">{label}</span>
            <span
                className={`${highlight ? "text-green-400" : "text-white"
                    } font-medium`}
            >
                {value}
            </span>
        </div>
    );
}

/* ---------- SKELETON ---------- */
function SuccessSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
            <div className="animate-pulse w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="h-6 bg-white/10 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-white/10 rounded w-2/3 mx-auto" />
                <div className="space-y-3 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-white/10 rounded w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}