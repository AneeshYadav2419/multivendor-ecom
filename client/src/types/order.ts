export type PaymentStatus = "PAID" | "PENDING" | "FAILED";
export type FulfillmentStatus =
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    createdAt: string;
}