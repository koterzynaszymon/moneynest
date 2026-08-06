import { Skeleton } from "@/components/ui/skeleton";

function WalletCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-4 w-48 max-w-full" />
    </div>
  );
}

export function WalletsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <WalletCardSkeleton />
        <WalletCardSkeleton />
        <WalletCardSkeleton />
        <WalletCardSkeleton />
      </div>
    </div>
  );
}
