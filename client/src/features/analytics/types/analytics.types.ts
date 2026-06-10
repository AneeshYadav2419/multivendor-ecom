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