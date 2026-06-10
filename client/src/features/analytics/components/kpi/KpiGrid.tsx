import {
    DollarSign,
    ShoppingCart,
    Users,
    Store,
} from "lucide-react";

import KpiCard from "./KpiCard";
import { AnalyticsOverview } from "../../types/analytics.types";

interface Props {
    data: AnalyticsOverview;
}

export default function KpiGrid({
    data,
}: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <KpiCard
                title="Revenue"
                value={`₹${data.revenue.toLocaleString()}`}
                icon={<DollarSign size={18} />}
            />

            <KpiCard
                title="Orders"
                value={data.orders}
                icon={<ShoppingCart size={18} />}
            />

            <KpiCard
                title="Customers"
                value={data.customers}
                icon={<Users size={18} />}
            />

            <KpiCard
                title="Vendors"
                value={data.vendors}
                icon={<Store size={18} />}
            />

        </div>
    );
}