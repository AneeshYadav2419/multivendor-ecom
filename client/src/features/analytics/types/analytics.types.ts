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