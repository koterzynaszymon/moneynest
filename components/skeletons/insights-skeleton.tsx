import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  BarChartSkeleton,
  DoughnutChartSkeleton,
} from "@/components/skeletons/chart-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-24" />
      </CardHeader>
    </Card>
  );
}

function ChartCardSkeleton({
  variant,
}: {
  variant: "bar" | "doughnut";
}) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full max-w-xs" />
      </CardHeader>
      <CardContent>
        {variant === "bar" ? <BarChartSkeleton /> : <DoughnutChartSkeleton />}
      </CardContent>
    </Card>
  );
}

export function InsightsSkeleton() {
  return (
    <div>
      <div className="space-y-1">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="mt-6 space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </section>

        <section className="grid gap-4 md:grid-cols-2 grid-cols-1">
          <ChartCardSkeleton variant="bar" />
          <ChartCardSkeleton variant="doughnut" />
          <ChartCardSkeleton variant="doughnut" />
        </section>
      </div>
    </div>
  );
}
