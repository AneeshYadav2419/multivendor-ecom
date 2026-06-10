"use client";

import AnalyticsHeader from "@/features/analytics/components/dashboard/AnalyticsHeader";
import AnalyticsPageSkeleton from "@/features/analytics/components/dashboard/AnalyticsPageSkeleton";
import KpiGrid from "@/features/analytics/components/kpi/KpiGrid";
import { useAnalyticsDashboard } from "@/features/analytics/hooks/useAnalyticsDashboard";
import AnalyticsError from "@/features/analytics/components/dashboard/AnalyticsError";
import AnalyticsFilters from "@/features/analytics/components/dashboard/AnalyticsFilters";
import RevenueChart from
    "@/features/analytics/components/charts/RevenueChart";
import { useRevenueTrend }
    from "@/features/analytics/hooks/useRevenueTrend";
import OrdersChart from
    "@/features/analytics/components/charts/OrdersChart";

import { useOrdersTrend }
    from "@/features/analytics/hooks/useOrdersTrend";

import TopProductsTable from "@/features/analytics/components/tables/TopProductsTable";
import { useTopProducts } from "@/features/analytics/hooks/useTopProducts";

export default function AnalyticsPage() {
    const {
        data,
        isLoading,
        isError,
    } = useAnalyticsDashboard();

    const revenueTrend =
        useRevenueTrend();
    const ordersTrend =
        useOrdersTrend();
    const topProducts = useTopProducts();

    // if (isLoading) {
    //     return (
    //         <div className="p-6">
    //             Loading analytics...
    //         </div>
    //     );
    // }
    if (isLoading) {
        return <AnalyticsPageSkeleton />;
    }
    if (isError || !data) {
        return <AnalyticsError />;
    }

    return (
        <div className="space-y-8 p-6">
            <AnalyticsHeader />

            <AnalyticsFilters />
            <KpiGrid data={data} />
            <div className="grid gap-6 lg:grid-cols-2">
                <RevenueChart
                    data={revenueTrend.data ?? []}
                />

                <OrdersChart
                    data={ordersTrend.data ?? []}
                />
                <TopProductsTable
                    products={topProducts.data ?? []}
                />
            </div>
        </div>
    );
}