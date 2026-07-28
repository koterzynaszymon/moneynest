import { Skeleton } from "@/components/ui/skeleton";

/** Bar-style placeholder matching the h-64 chart plot area. */
export function BarChartSkeleton() {
  return (
    <div
      className="flex h-64 w-full flex-col justify-end gap-3 rounded-lg border border-dashed p-4"
      aria-hidden
    >
      <div className="flex flex-1 items-end justify-between gap-3 px-2">
        <Skeleton className="h-16 w-full max-w-[18%]" />
        <Skeleton className="h-28 w-full max-w-[18%]" />
        <Skeleton className="h-40 w-full max-w-[18%]" />
        <Skeleton className="h-20 w-full max-w-[18%]" />
        <Skeleton className="h-32 w-full max-w-[18%]" />
      </div>
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

/** Doughnut-style placeholder: ring + legend. */
export function DoughnutChartSkeleton() {
  return (
    <div
      className="flex h-64 w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
      aria-hidden
    >
      <Skeleton className="size-40 shrink-0 rounded-full" />
      <div className="flex w-full max-w-[10rem] flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
