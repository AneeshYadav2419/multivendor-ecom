import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton: React.FC = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <Skeleton className="mb-8 h-4 w-32" />
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
