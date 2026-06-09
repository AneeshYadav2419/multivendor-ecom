// "use client";

// import { useEffect, useState } from "react";
// import { fetchOrders } from "@/lib/api/order";
// import { Order } from "@/types/order";

// export const useOrders = () => {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const loadOrders = async () => {
//         try {
//             setLoading(true);
//             const data = await fetchOrders();
//             setOrders(data);
//         } catch (err) {
//             setError("Failed to load orders");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadOrders();
//     }, []);

//     return { orders, loading, error, refetch: loadOrders };
// };
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchOrders } from "@/lib/api/order";
import { Order } from "@/types/order";

interface UseOrdersParams {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export const useOrders = (params?: UseOrdersParams) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(params?.page || 1);
    const [limit] = useState(params?.limit || 10);

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetchOrders({
                search: params?.search,
                status: params?.status,
                page,
                limit,
            });

            // ✅ SAFE EXTRACTION (VERY IMPORTANT)
            // const list = Array.isArray(res?.data) ? res.data : [];
            setOrders(res.data); // because data contains array
            // setOrders(res?.data || []);

            // setOrders(list);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch orders");
            setOrders([]); // safety fallback
        } finally {
            setLoading(false);
        }
    }, [params?.search, params?.status, page, limit]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const refetch = () => {
        loadOrders();
    };

    const nextPage = () => setPage((p) => p + 1);
    const prevPage = () => setPage((p) => Math.max(1, p - 1));

    return {
        orders,
        loading,
        error,

        page,
        limit,
        nextPage,
        prevPage,

        refetch,
    };
};