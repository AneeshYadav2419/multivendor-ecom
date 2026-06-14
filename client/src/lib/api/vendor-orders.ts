import { api } from "@/lib/api/axios";
import { Order } from "@/types/order";

export interface VendorOrdersResponse {
  success: boolean;
  results: number;
  data: Order[];
}

export interface VendorOrderDetailResponse {
  success: boolean;
  data: Order & {
    orderItems: any[];
    shippingAddress: any;
    billingAddress: any;
  }; // Extending simple Order with detailed fields
}

export interface VendorOrderUpdateResponse {
  success: boolean;
  message: string;
  data: Order;
}

/**
 * Fetches orders belonging to the logged-in vendor.
 * GET /api/vendors/orders
 */
export const getVendorOrders = async (): Promise<VendorOrdersResponse> => {
  const response = await api.get<VendorOrdersResponse>("/vendors/orders");
  return response.data;
};

/**
 * Fetches a specific order's details for the vendor.
 * GET /api/vendors/orders/:id
 */
export const getVendorOrderById = async (id: string): Promise<VendorOrderDetailResponse> => {
  const response = await api.get<VendorOrderDetailResponse>(`/vendors/orders/${id}`);
  return response.data;
};

/**
 * Updates the fulfillment status of an order for a vendor.
 * PATCH /api/vendors/orders/:id/status
 */
export const updateVendorOrderStatus = async (
  id: string,
  data: { fulfillmentStatus: string }
): Promise<VendorOrderUpdateResponse> => {
  const response = await api.patch<VendorOrderUpdateResponse>(`/vendors/orders/${id}/status`, data);
  return response.data;
};
