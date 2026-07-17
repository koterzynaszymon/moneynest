import { notFound } from "next/navigation";

import { FolderTree, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HouseholdHeader } from "@/components/households/household-header";
import { ModuleCard } from "@/components/households/module-card";
import { getCategories } from "@/lib/categories/queries";
import {
  getHouseholdById,
  getHouseholdMembers,
} from "@/lib/households/queries";
import { getTransactions } from "@/lib/transactions/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type HouseholdDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HouseholdDetailPage({
  params,
}: HouseholdDetailPageProps) {
  const { id } = await params;
  const [household, members, categories, recentTransactions] = await Promise.all([
    getHouseholdById(id),
    getHouseholdMembers(id),
    getCategories(id),
    getTransactions(id, 1, 3, "all", "date", "desc"),
  ]);

  if (!household) {
    notFound();
  }

  const previewCategories = categories.slice(0, 8);
  const hiddenCategoryCount = Math.max(
    categories.length - previewCategories.length,
    0,
  );

  return (
    <div className="space-y-6">
      <HouseholdHeader household={household} members={members} />

      <section className="grid gap-6 lg:grid-cols-1">
        <div className="grid gap-6 md:grid-cols-2 min-w-0">
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
                    <TableHead className="hidden lg:block">Description</TableHead>
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
        </div>
      </section>
    </div>
  );
}