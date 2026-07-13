import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FolderTree, Receipt } from "lucide-react";

import { HouseholdHeader } from "@/components/households/household-header";
import { ModuleCard } from "@/components/households/module-card";
import {
  getHouseholdById,
  getHouseholdMembers,
} from "@/lib/households/queries";

type HouseholdDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function HouseholdDetailContent({
  params,
}: HouseholdDetailPageProps) {
  const { id } = await params;
  const [household, members] = await Promise.all([
    getHouseholdById(id),
    getHouseholdMembers(id),
  ]);

  if (!household) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <HouseholdHeader household={household} members={members} />

      <section className="grid gap-6 lg:grid-cols-1">
        <div className="grid gap-6 sm:grid-cols-2">
          <ModuleCard
            icon={FolderTree}
            title="Categories"
            description="Organize spending and income with shared household categories."
            footerButtonText="Manage categories"
            footerButtonLink={`/household/${id}/categories`}
          />
          <ModuleCard
            icon={Receipt}
            title="Transactions"
            description="Track activity across the household once transaction flows are added."
          />
        </div>
      </section>
    </div>
  );
}

export default function HouseholdDetailPage(params: HouseholdDetailPageProps) {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading household...</p>
      }
    >
      <HouseholdDetailContent {...params} />
    </Suspense>
  );
}