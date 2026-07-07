import { Suspense } from "react";
import { getUserHouseholds } from "@/lib/households/queries";
import CreateHouseholdModal from "@/components/dashboard/create-household-modal";
import { HouseholdCard } from "@/components/dashboard/household-card";
async function HouseholdsSection() {
  const households = await getUserHouseholds();
  console.log(households);
  
  return (
    <div className="flex flex-col gap-4">
      {households.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
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
          <div className="flex justify-center items-center">
            <CreateHouseholdModal />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-foreground/60">No households found</p>
          <CreateHouseholdModal />
        </div>
      )}
    </div>
  );
}

export default async function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <h1 className="font-bold text-2xl">Your dashboard</h1>
      <Suspense fallback={<p className="text-foreground/60">Loading…</p>}>
        <HouseholdsSection />
      </Suspense>
    </div>
  );
}
