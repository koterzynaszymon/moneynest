import { notFound } from "next/navigation";

import { ChartColumn, FolderTree, PiggyBank, Receipt, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Amount } from "@/components/ui/amount";
import { HouseholdHeader } from "@/components/households/household-header";
import { ModuleCard } from "@/components/households/module-card";
import { getBudget } from "@/lib/budgets/queries";
import { getCategories } from "@/lib/categories/queries";
import {
  getHouseholdById,
  getHouseholdMembers,
} from "@/lib/households/queries";
import {
  getMonthlyExpenseTotal,
  getMonthlyIncomeTotal,
  getTransactions,
} from "@/lib/transactions/queries";
import { getUserId } from "@/lib/users/queries";
import { getWallets } from "@/lib/wallets/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgressBar } from "@/components/ui/progress-bar";

type HouseholdDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HouseholdDetailPage({
  params,
}: HouseholdDetailPageProps) {
  const { id } = await params;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [
    household,
    members,
    categories,
    recentTransactions,
    budgetResult,
    spentThisMonth,
    incomeThisMonth,
    userId,
    wallets,
  ] = await Promise.all([
    getHouseholdById(id),
    getHouseholdMembers(id),
    getCategories(id),
    getTransactions(id, 1, 3, "all", "date", "desc"),
    getBudget(id, currentYear, currentMonth),
    getMonthlyExpenseTotal(id, currentYear, currentMonth),
    getMonthlyIncomeTotal(id, currentYear, currentMonth),
    getUserId(),
    getWallets(id),
  ]);

  if (!household) {
    notFound();
  }

  const isOwner = household.owner_id === userId;

  const previewCategories = categories.slice(0, 8);
  const hiddenCategoryCount = Math.max(
    categories.length - previewCategories.length,
    0,
  );
  const previewWallets = wallets.slice(0, 6);
  const hiddenWalletCount = Math.max(wallets.length - previewWallets.length, 0);
  const expenseCategoryCount = categories.filter(
    (category) => category.type === "expense",
  ).length;
  const currentMonthBudget = budgetResult.success ? budgetResult.budget : null;
  const netThisMonth = incomeThisMonth - spentThisMonth;
  const budgetUsedPercent =
    currentMonthBudget && currentMonthBudget.total_amount > 0
      ? Math.round((spentThisMonth / currentMonthBudget.total_amount) * 100)
      : null;

  return (
    <div className="space-y-6">
      <HouseholdHeader
        household={household}
        members={members}
        isOwner={isOwner}
      />

      <section className="grid gap-6 lg:grid-cols-1">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 min-w-0">
          <ModuleCard
            icon={FolderTree}
            title="Categories"
            description="Organize spending and income with shared household categories."
            footerButtonText="Manage categories"
            footerButtonLink={`/household/${id}/categories`}
          >
            {previewCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {previewCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={category.type === "income" ? "income" : "expense"}
                    className="py-1"
                  >
                    {category.name}
                  </Badge>
                ))}
                {hiddenCategoryCount > 0 ? (
                  <Badge variant="outline">+{hiddenCategoryCount} more</Badge>
                ) : null}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                No categories yet. Create your first one to organize future
                transactions.
              </div>
            )}
          </ModuleCard>
          <ModuleCard
            icon={Receipt}
            title="Transactions"
            description="Track activity across the household. Those are the most recent transactions."
            footerButtonText="View transactions"
            footerButtonLink={`/household/${id}/transactions`}
          >
            {recentTransactions.transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden lg:block">
                      Description
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.transactions.map((transaction) => {
                    const category = categories.find(
                      (c) => c.id === transaction.category_id,
                    );
                    const isIncome = category?.type === "income";
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-muted-foreground">
                          {new Date(
                            transaction.transaction_date,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="max-w-[140px] truncate hidden lg:block">
                          {transaction.description || "No description"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isIncome ? "income" : "expense"}>
                            {category?.name ?? "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${
                            isIncome ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {transaction.amount}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                No transactions yet. Create your first one to track activity
                across the household.
              </div>
            )}
          </ModuleCard>
          <ModuleCard
            icon={PiggyBank}
            title="Budgets"
            description="Plan monthly spending limits for the household and expense categories."
            footerButtonText="Manage budgets"
            footerButtonLink={`/household/${id}/budgets`}
          >
            {expenseCategoryCount > 0 ? (
              <div className="space-y-3">
                <div className="rounded-lg border bg-muted/30 px-4 py-5">
                  {currentMonthBudget ? (
                    <ProgressBar
                      currentValue={spentThisMonth}
                      targetValue={currentMonthBudget.total_amount}
                      currency={household.currency}
                      title="Left this month"
                      currentLabel="Used"
                      targetLabel="Limit"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No budget set for this month yet.
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Start with a total monthly budget, then add category limits.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                Create expense categories first, then use budgets to set monthly
                limits.
              </div>
            )}
          </ModuleCard>
          <ModuleCard
            icon={ChartColumn}
            title="Insights"
            description="View insights and reports about the household's spending and income."
            footerButtonText="View insights"
            footerButtonLink={`/household/${id}/insights`}
          >
            <div className="space-y-3 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Spent this month
                  </span>
                  <Amount
                    value={spentThisMonth}
                    currency={household.currency}
                    tone="expense"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Income this month
                  </span>
                  <Amount
                    value={incomeThisMonth}
                    currency={household.currency}
                    tone="income"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Net</span>
                  <Amount
                    value={netThisMonth}
                    currency={household.currency}
                    tone="sign"
                    showPlus
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {budgetUsedPercent !== null
                  ? `${budgetUsedPercent}% of this month's budget used.`
                  : "Set a budget to track monthly usage here."}
              </p>
            </div>
          </ModuleCard>
          <ModuleCard
            icon={Wallet}
            title="Wallets"
            description="View and manage the household's wallets."
            footerButtonText="View wallets"
            footerButtonLink={`/household/${id}/wallets`}
          >
            {previewWallets.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {previewWallets.map((wallet) => (
                    <Badge key={wallet.id} variant="outline" className="py-1">
                      {wallet.name}
                    </Badge>
                  ))}
                  {hiddenWalletCount > 0 ? (
                    <Badge variant="outline">+{hiddenWalletCount} more</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {wallets.length} wallet{wallets.length === 1 ? "" : "s"} in
                  this household.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                No wallets yet. Create your first one to start tracking your
                spending.
              </div>
            )}
          </ModuleCard>
        </div>
      </section>
    </div>
  );
}
