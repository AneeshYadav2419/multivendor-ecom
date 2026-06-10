"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { OrdersTrendItem } from "../../types/analytics.types";

interface Props {
    data: OrdersTrendItem[];
}

export default function OrdersChart({
    data,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">
                Orders Trend
            </h2>

            <div className="h-[350px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="orders"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}