import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40">
    <Skeleton className="aspect-[4/5] w-full rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-24" />
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
