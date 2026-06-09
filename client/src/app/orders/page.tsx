"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

type Order = {
    id: string;
    totalAmount: number;
    paymentStatus: "PAID" | "FAILED" | "PENDING";
    status: "PROCESSING" | "SHIPPED" | "DELIVERED";
    createdAt: string;
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders/my");
                setOrders(res.data.data || []);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <OrdersSkeleton />;

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-2xl font-semibold text-white mb-6">
                    My Orders
                </h1>

                {error && (
                    <div className="text-red-400 mb-4">{error}</div>
                )}

                {orders.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-medium">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <p className="text-white font-semibold">
                                        ₹{order.totalAmount}
                                    </p>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <Badge type="payment" value={order.paymentStatus} />
                                    <Badge type="status" value={order.status} />
                                </div>

                                <button
                                    onClick={() => router.push(`/orders/${order.id}`)}
                                    className="mt-4 text-sm text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- BADGE ---------- */
function Badge({
    value,
    type,
}: {
    value: string;
    type: "payment" | "status";
}) {
    const color =
        value === "PAID" || value === "DELIVERED"
            ? "bg-green-500/10 text-green-400"
            : value === "FAILED"
                ? "bg-red-500/10 text-red-400"
                : "bg-yellow-500/10 text-yellow-400";

    return (
        <span className={`text-xs px-2 py-1 rounded-md ${color}`}>
            {value}
        </span>
    );
}

/* ---------- EMPTY ---------- */
function EmptyState() {
    return (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
            <Package className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">No orders yet</p>
        </div>
    );
}

/* ---------- SKELETON ---------- */
function OrdersSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10">
            <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
                <div className="h-6 w-40 bg-white/10 rounded" />
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-white/10 rounded-xl"
                    />
                ))}
            </div>
        </div>
    );
}