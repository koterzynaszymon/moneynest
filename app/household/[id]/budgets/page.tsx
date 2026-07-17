import { notFound } from "next/navigation";

import { BudgetsBody } from "@/components/budgets/budgets-body";
import { BudgetsHeader } from "@/components/budgets/budgets-header";
import { getBudget } from "@/lib/budgets/queries";
import { getCategories } from "@/lib/categories/queries";
import { getHouseholdById } from "@/lib/households/queries";

export default async function BudgetsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [household, categories, currentBudgetResult] = await Promise.all([
    getHouseholdById(id),
    getCategories(id),
    getBudget(id, currentYear, currentMonth),
  ]);

  if (!household) {
    notFound();
  }

  const expenseCategories = categories.filter(
    (category) => category.type === "expense",
  );

  return (
    <div className="space-y-8">
      <BudgetsHeader householdName={household.name} />
      <BudgetsBody
        householdId={id}
        currency={household.currency}
        expenseCategories={expenseCategories}
        currentMonthBudget={
          currentBudgetResult.success ? currentBudgetResult.budget : null
        }
      />
    </div>
  );
}
