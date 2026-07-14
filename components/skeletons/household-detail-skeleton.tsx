import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ModuleSkeleton({ withFooter = false }: { withFooter?: boolean }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </CardContent>

      {withFooter ? (
        <CardFooter className="flex justify-end">
          <Skeleton className="h-9 w-36" />
        </CardFooter>
      ) : null}
    </Card>
  );
}

export function HouseholdDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-full max-w-lg" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
            <div className="flex -space-x-2">
              <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
              <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
              <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
            </div>
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-1">
        <div className="grid gap-6 sm:grid-cols-2">
          <ModuleSkeleton withFooter />
          <ModuleSkeleton />
        </div>
      </section>
    </div>
  );
}
