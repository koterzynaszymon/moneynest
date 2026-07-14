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

type HouseholdDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HouseholdDetailPage({
  params,
}: HouseholdDetailPageProps) {
  const { id } = await params;
  const [household, members, categories] = await Promise.all([
    getHouseholdById(id),
    getHouseholdMembers(id),
    getCategories(id),
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
        <div className="grid gap-6 sm:grid-cols-2">
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
            description="Track activity across the household."
            footerButtonText="View transactions"
            footerButtonLink={`/household/${id}/transactions`}
          >
            <p>Transactions are coming next.</p>
          </ModuleCard>
        </div>
      </section>
    </div>
  );
}