import { Order } from "./order";

export interface OrdersResponse {
    success: boolean;
    data: Order[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}