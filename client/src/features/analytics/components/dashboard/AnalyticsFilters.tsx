const ranges = [
    "7D",
    "30D",
    "90D",
    "1Y",
];

export default function AnalyticsFilters() {
    return (
        <div className="flex gap-2">
            {ranges.map((range) => (
                <button
                    key={range}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                >
                    {range}
                </button>
            ))}
        </div>
    );
}