import { InsightsHeader } from "@/components/insights/insights-header";
import { InsightsBody } from "@/components/insights/insights-body";
export default async function InsightsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <InsightsHeader />
      <InsightsBody householdId={id} />
    </div>
  );
}
