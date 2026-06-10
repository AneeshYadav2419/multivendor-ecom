export interface DashboardOverview {
    revenue: number;
    orders: number;
    customers: number;
    vendors: number;
}
export interface RevenueTrendItem {
    month: string;
    revenue: number;
}
export interface OrdersTrendItem {
    month: string;
    orders: number;
}