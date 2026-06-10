// "use client";

// import AnalyticsHeader from "@/features/analytics/components/dashboard/AnalyticsHeader";
// import AnalyticsPageSkeleton from "@/features/analytics/components/dashboard/AnalyticsPageSkeleton";
// import KpiGrid from "@/features/analytics/components/kpi/KpiGrid";
// import { useAnalyticsDashboard } from "@/features/analytics/hooks/useAnalyticsDashboard";
// import AnalyticsError from "@/features/analytics/components/dashboard/AnalyticsError";
// import AnalyticsFilters from "@/features/analytics/components/dashboard/AnalyticsFilters";
// import RevenueChart from
//     "@/features/analytics/components/charts/RevenueChart";
// import { useRevenueTrend }
//     from "@/features/analytics/hooks/useRevenueTrend";
// import OrdersChart from
//     "@/features/analytics/components/charts/OrdersChart";

// import { useOrdersTrend }
//     from "@/features/analytics/hooks/useOrdersTrend";

// import TopProductsTable from "@/features/analytics/components/tables/TopProductsTable";
// import { useTopProducts } from "@/features/analytics/hooks/useTopProducts";

// import TopVendorsTable from "@/features/analytics/components/tables/TopVendorsTable";
// import { useTopVendors } from "@/features/analytics/hooks/useTopVendors";

// export default function AnalyticsPage() {
//     const {
//         data,
//         isLoading,
//         isError,
//     } = useAnalyticsDashboard();

//     const revenueTrend =
//         useRevenueTrend();
//     const ordersTrend =
//         useOrdersTrend();
//     const topProducts = useTopProducts();
//     const topVendors = useTopVendors();

//     // if (isLoading) {
//     //     return (
//     //         <div className="p-6">
//     //             Loading analytics...
//     //         </div>
//     //     );
//     // }
//     if (isLoading) {
//         return <AnalyticsPageSkeleton />;
//     }
//     if (isError || !data) {
//         return <AnalyticsError />;
//     }

//     return (
//         <div className="space-y-8 p-6">
//             <AnalyticsHeader />

//             <AnalyticsFilters />
//             <KpiGrid data={data} />
//             <div className="grid gap-6 lg:grid-cols-2">
//                 <RevenueChart
//                     data={revenueTrend.data ?? []}
//                 />

//                 <OrdersChart
//                     data={ordersTrend.data ?? []}
//                 />
//                 <TopProductsTable
//                     products={topProducts.data ?? []}
//                 />
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     <TopProductsTable
//                         products={topProducts.data ?? []}
//                     />

//                     <TopVendorsTable
//                         vendors={topVendors.data ?? []}
//                     />
//                 </div>

//             </div>
//         </div>
//     );
// }

"use client";

import AnalyticsHeader from "@/features/analytics/components/dashboard/AnalyticsHeader";
import AnalyticsPageSkeleton from "@/features/analytics/components/dashboard/AnalyticsPageSkeleton";
import AnalyticsError from "@/features/analytics/components/dashboard/AnalyticsError";
import AnalyticsFilters from "@/features/analytics/components/dashboard/AnalyticsFilters";

import KpiGrid from "@/features/analytics/components/kpi/KpiGrid";

import RevenueChart from "@/features/analytics/components/charts/RevenueChart";
import OrdersChart from "@/features/analytics/components/charts/OrdersChart";

import TopProductsTable from "@/features/analytics/components/tables/TopProductsTable";
import TopVendorsTable from "@/features/analytics/components/tables/TopVendorsTable";

import { useAnalyticsDashboard } from "@/features/analytics/hooks/useAnalyticsDashboard";
import { useRevenueTrend } from "@/features/analytics/hooks/useRevenueTrend";
import { useOrdersTrend } from "@/features/analytics/hooks/useOrdersTrend";
import { useTopProducts } from "@/features/analytics/hooks/useTopProducts";
import { useTopVendors } from "@/features/analytics/hooks/useTopVendors";
import RecentOrdersTable from
    "@/features/analytics/components/tables/RecentOrdersTable";

import { useRecentOrders }
    from "@/features/analytics/hooks/useRecentOrders";
import Link from "next/link";

export default function AnalyticsPage() {
    const {
        data,
        isLoading,
        isError,
    } = useAnalyticsDashboard();

    const revenueTrend = useRevenueTrend();
    const ordersTrend = useOrdersTrend();
    const topProducts = useTopProducts();
    const topVendors = useTopVendors();
    const recentOrders =
        useRecentOrders();

    if (isLoading) {
        return <AnalyticsPageSkeleton />;
    }

    if (isError || !data) {
        return <AnalyticsError />;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-10 p-6 lg:p-8">

            {/* Header */}
            <AnalyticsHeader />

            {/* Filters */}
            <AnalyticsFilters />

            {/* KPI Cards */}
            <KpiGrid data={data} />

            {/* Performance Overview */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Performance Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Track revenue growth and order performance over time.
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <RevenueChart
                        data={revenueTrend.data ?? []}
                    />

                    <OrdersChart
                        data={ordersTrend.data ?? []}
                    />
                </div>
            </section>

            {/* Business Insights */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Business Insights
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Discover your best-performing products and vendors.
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <TopProductsTable
                        products={topProducts.data ?? []}
                    />

                    <TopVendorsTable
                        vendors={topVendors.data ?? []}
                    />
                </div>
            </section>
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Recent Activity
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Latest customer orders.
                    </p>
                </div>

                <RecentOrdersTable
                    orders={recentOrders.data ?? []}
                />
            </section>
            <Link
                href="/admin/orders"
                className="mt-4 inline-flex text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
                View All Orders →
            </Link>
        </div>

    );
}