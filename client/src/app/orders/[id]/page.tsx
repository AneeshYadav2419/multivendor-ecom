"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/axios";
import { ArrowLeft, Package, CreditCard, Loader2 } from "lucide-react";

type Order = {
    id: string;
    paymentId: string;
    paymentStatus: "PAID" | "FAILED" | "PENDING";
    orderStatus: "PROCESSING" | "SHIPPED" | "DELIVERED";
    totalAmount: number;
};

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.data);
            } catch (err) {
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    // ─────────────────────────────
    // LOADING STATE (SKELETON)
    // ─────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
                <div className="w-full max-w-2xl animate-pulse space-y-4">
                    <div className="h-6 w-40 bg-white/10 rounded" />
                    <div className="h-40 bg-white/10 rounded-xl" />
                    <div className="h-24 bg-white/10 rounded-xl" />
                </div>
            </div>
        );
    }

    // ─────────────────────────────
    // ERROR STATE
    // ─────────────────────────────
    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
                <div className="text-center bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md">
                    <h2 className="text-white text-xl font-semibold mb-2">
                        Order not found
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        We couldn’t fetch this order. It may have been removed or is invalid.
                    </p>

                    <button
                        onClick={() => router.push("/orders")}
                        className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
                    >
                        Go to My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to Orders
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Order Details
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Full breakdown of your purchase
                    </p>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6">

                    {/* Order ID */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                        <span className="text-gray-400 text-sm">Order ID</span>
                        <span className="text-white font-medium break-all text-xs sm:text-sm">{order.id}</span>
                    </div>

                    {/* Payment ID */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                        <span className="text-gray-400 text-sm flex items-center gap-2">
                            <CreditCard size={14} /> Payment ID
                        </span>
                        <span className="text-white font-medium break-all text-xs sm:text-sm">
                            {order.paymentId}
                        </span>
                    </div>

                    {/* Payment Status */}
                    <Row
                        label="Payment Status"
                        value={order.paymentStatus}
                        type="payment"
                    />

                    {/* Order Status */}
                    <Row
                        label="Order Status"
                        value={order.orderStatus}
                        type="order"
                    />

                    {/* Total */}
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-gray-300 font-medium">
                            Total Paid
                        </span>
                        <span className="text-white text-xl font-semibold">
                            ₹{order.totalAmount}
                        </span>
                    </div>
                </div>

                {/* Footer hint */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    Need help? Contact support for order issues.
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────
   STATUS ROW COMPONENT
───────────────────────────── */
function Row({
    label,
    value,
    type,
}: {
    label: string;
    value: string;
    type: "payment" | "order";
}) {
    const getColor = () => {
        if (value === "PAID" || value === "DELIVERED") {
            return "bg-green-500/10 text-green-400";
        }
        if (value === "FAILED") {
            return "bg-red-500/10 text-red-400";
        }
        return "bg-yellow-500/10 text-yellow-400";
    };

    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className={`px-3 py-1 rounded-md text-xs ${getColor()}`}>
                {value}
            </span>
        </div>
    );
}