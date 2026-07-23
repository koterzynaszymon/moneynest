import { notFound } from "next/navigation";

import { InsightsHeader } from "@/components/insights/insights-header";
import { InsightsBody } from "@/components/insights/insights-body";
import { getHouseholdById } from "@/lib/households/queries";

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const household = await getHouseholdById(id);

  if (!household) {
    notFound();
  }

  return (
    <div>
      <InsightsHeader />
      <InsightsBody householdId={id} currency={household.currency} />
    </div>
  );
}
