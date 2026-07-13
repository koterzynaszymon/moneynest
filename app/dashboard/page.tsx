import { Suspense } from "react";
import { getUserHouseholds } from "@/lib/households/queries";
import CreateHouseholdModal from "@/components/dashboard/create-household-modal";
import { HouseholdCard } from "@/components/dashboard/household-card";
import { Home } from "lucide-react";

async function HouseholdsSection() {
  const households = await getUserHouseholds();

  if (households.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Home className="h-6 w-6" />
        </span>
        <div className="space-y-1">
          <h2 className="font-display text-lg font-semibold">
            No households yet
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first household to start tracking shared finances with
            the people you live with.
          </p>
        </div>
        <CreateHouseholdModal />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {households.map((household) => (
          <HouseholdCard
            key={household.id}
            id={household.id}
            name={household.name}
            currency={household.currency}
            memberCount={household.memberCount}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <CreateHouseholdModal />
      </div>
    </div>
  );
}

export default async function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Your dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage the households you share your finances with.
        </p>
      </div>
      <Suspense
        fallback={<p className="text-muted-foreground">Loading…</p>}
      >
        <HouseholdsSection />
      </Suspense>
    </div>
  );
}
