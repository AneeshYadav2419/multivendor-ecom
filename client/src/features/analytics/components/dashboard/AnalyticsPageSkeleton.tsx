import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPageSkeleton() {
    return (
        <div className="space-y-8 p-6">
            <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="mt-2 h-4 w-72" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-36 rounded-2xl"
                    />
                ))}
            </div>
        </div>
    );
}