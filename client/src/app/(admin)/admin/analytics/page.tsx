"use client";

import AnalyticsHeader from "@/features/analytics/components/dashboard/AnalyticsHeader";
import AnalyticsPageSkeleton from "@/features/analytics/components/dashboard/AnalyticsPageSkeleton";
import KpiGrid from "@/features/analytics/components/kpi/KpiGrid";
import { useAnalyticsDashboard } from "@/features/analytics/hooks/useAnalyticsDashboard";
import AnalyticsError from "@/features/analytics/components/dashboard/AnalyticsError";
import AnalyticsFilters from "@/features/analytics/components/dashboard/AnalyticsFilters";
export default function AnalyticsPage() {
    const {
        data,
        isLoading,
        isError,
    } = useAnalyticsDashboard();

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
        </div>
    );
}