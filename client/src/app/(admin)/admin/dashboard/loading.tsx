import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-40 rounded-3xl" />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-32 rounded-2xl"
                    />
                ))}
            </div>
        </div>
    );
}