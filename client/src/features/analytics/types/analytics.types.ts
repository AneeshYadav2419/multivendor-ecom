export interface AnalyticsOverview {
    revenue: number;
    orders: number;
    customers: number;
    vendors: number;
}

export interface AnalyticsDashboardResponse {
    success: boolean;
    data: AnalyticsOverview;
}
export interface RevenueTrendItem {
    month: string;
    revenue: number;
}
export interface OrdersTrendItem {
    month: string;
    orders: number;
}
export interface TopProduct {
    productId: string;
    name: string;
    orders: number;
    revenue: number;
}
export interface TopVendor {
    vendorId: string;
    storeName: string;
    orders: number;
    revenue: number;
}
export interface RecentOrder {
    id: string;
    customerName: string;
    amount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}