export default function AnalyticsError() {
    return (
        <div className="rounded-xl border border-red-800 bg-red-950/20 p-6">
            <h3 className="font-semibold text-red-400">
                Failed to load analytics
            </h3>

            <p className="mt-2 text-sm text-red-300">
                Please refresh the page and try again.
            </p>
        </div>
    );
}