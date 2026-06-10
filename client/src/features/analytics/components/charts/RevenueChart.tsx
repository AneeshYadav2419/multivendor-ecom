"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { RevenueTrendItem } from "../../types/analytics.types";

interface Props {
    data: RevenueTrendItem[];
}

export default function RevenueChart({
    data,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">
                Revenue Trend
            </h2>

            <div className="h-[350px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}