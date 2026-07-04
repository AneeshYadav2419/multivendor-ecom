// import axios from "axios";
// import { Order } from "@/types/order";

// export const fetchOrders = async (): Promise<Order[]> => {
//     const res = await axios.get("/api/admin/orders");
//     return res.data;
// };

// export const fetchOrderById = async (id: string) => {
//     const res = await axios.get(`/api/admin/orders/${id}`);
//     return res.data;
// };

// export const updateOrder = async (id: string, data: any) => {
//     const res = await axios.patch(`/api/admin/orders/${id}`, data);
//     return res.data;
// };

import { api } from "@/lib/api/axios";
import { OrdersResponse } from "@/types/api";
import { Order } from "@/types/order";

export const fetchOrders = async (params?: any) => {
    const res = await api.get("/admin/orders", { params });
    return res.data;
};

/**
 * GET SINGLE ORDER (FOR DRAWER)
 */
export const fetchOrderById = async (id: string) => {
    const res = await api.get(`/admin/orders/${id}`);
    return res.data;
};

/**
 * UPDATE ORDER (status, shipping, etc.)
 */
export const updateOrder = async (
    id: string,
    data: {
        fulfillmentStatus?: string;
        paymentStatus?: string;
        trackingId?: string;
    }
) => {
    const res = await api.patch(`/admin/orders/${id}`, data);
    return res.data;
};

/**
 * CANCEL ORDER
 * (optional shortcut helper for UI buttons)
 */
export const cancelOrder = async (id: string) => {
    const res = await api.patch(`/admin/orders/${id}`, {
        fulfillmentStatus: "CANCELLED",
    });
    return res.data;
};