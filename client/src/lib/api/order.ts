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

import axios from "axios";
import { OrdersResponse } from "@/types/api";
import { Order } from "@/types/order";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => {
    return localStorage.getItem("token"); // or cookies if you use
};

export const fetchOrders = async (params?: any) => {
    const token = getToken();

    const res = await axios.get(`${API_URL}/admin/orders`, {
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

/**
 * GET SINGLE ORDER (FOR DRAWER)
 */
export const fetchOrderById = async (id: string) => {
    const token = getToken();

    const res = await axios.get(`${API_URL}/admin/orders/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

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
    const res = await axios.patch(`${API_URL}/admin/orders/${id}`, data);
    return res.data;
};

/**
 * CANCEL ORDER
 * (optional shortcut helper for UI buttons)
 */
export const cancelOrder = async (id: string) => {
    const res = await axios.patch(`${API_URL}/admin/orders/${id}`, {
        fulfillmentStatus: "CANCELLED",
    });

    return res.data;
};