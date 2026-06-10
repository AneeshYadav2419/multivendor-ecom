import { ReactNode } from "react";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
}

export default function KpiCard({
    title,
    value,
    icon,
}: KpiCardProps) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm transition-all hover:border-slate-700 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                    {title}
                </span>

                <div className="text-slate-400">
                    {icon}
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-3xl font-bold text-white">
                    {value}
                </h2>
            </div>
        </div>
    );
}