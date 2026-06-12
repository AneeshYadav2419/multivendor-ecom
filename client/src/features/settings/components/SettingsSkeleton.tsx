export default function SettingsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-6 w-40 bg-slate-200 rounded" />

            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 w-full bg-slate-200 rounded-lg" />
                ))}
            </div>

            <div className="h-10 w-32 bg-slate-300 rounded-lg ml-auto" />
        </div>
    );
}