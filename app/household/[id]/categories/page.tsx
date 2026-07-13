import { getCategories } from "@/lib/categories/queries";
import { getHouseholdById } from "@/lib/households/queries";
import { notFound } from "next/navigation";
import { CategoriesBody } from "@/components/categories/categories-body";
import { CategoriesHeader } from "@/components/categories/categories-header";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const household = await getHouseholdById(id);
  if (!household) {
    notFound();
  }
  const categories = await getCategories(id);
  return (
    <div className="space-y-8">
      <CategoriesHeader
        householdName={household.name}
        categoryCount={categories.length}
      />
      <CategoriesBody householdId={id} categories={categories} />
    </div>
  );
}
