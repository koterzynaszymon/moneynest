import { TransactionsHeader } from "@/components/transactions/transactions-header";
import { TransactionsBody } from "@/components/transactions/transactions-body";
import { getHouseholdById } from "@/lib/households/queries";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories/queries";

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const household = await getHouseholdById(id);
  const categories = await getCategories(id);
  if (!household) {
    notFound();
  }
  return (
    <div className="space-y-8">
      <TransactionsHeader householdId={id} categories={categories} />
      <TransactionsBody householdId={id} categories={categories} />
    </div>
  );
}