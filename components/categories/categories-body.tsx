"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addCategory, deleteCategory } from "@/lib/categories/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/types/categories";
import { Loader2, X } from "lucide-react";

type CategoriesBodyProps = {
  householdId: string;
  categories: Category[];
};

export function CategoriesBody({
  householdId,
  categories,
}: CategoriesBodyProps) {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<Category["type"]>("expense");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const trimmedName = categoryName.trim();
  const isDuplicate = categories.some(
    (category) =>
      category.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
      category.type === categoryType,
  );
  const isSubmitDisabled = !trimmedName || isDuplicate || isLoading;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsLoading(true);

    const result = await addCategory(householdId, trimmedName, categoryType);

    if (result.success) {
      setCategoryName("");
      toast.success("Category added successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  }

  async function handleDelete(householdId: string, categoryId: string) {
    setIsDeleting(true);
    const result = await deleteCategory(householdId, categoryId);
    if (result.success) {
      toast.success("Category deleted successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Groceries, rent, salary..."
              className="sm:max-w-sm"
            />
            <select
              value={categoryType}
              onChange={(e) =>
                setCategoryType(e.target.value as Category["type"])
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isLoading ? "Adding..." : "Add category"}
            </Button>
          </form>
          {isDuplicate ? (
            <p className="mt-3 text-sm text-expense">
              This category already exists for the selected type.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={category.type === "income" ? "income" : "expense"}
              className="py-1 text-sm flex items-center gap-2 justify-between"
            >
              {category.name}
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-label="Deleting category" />
              ) : (
                <X className="h-4 w-4 hover:scale-150 hover:text-red-400 cursor-pointer transition-all duration-300" onClick={() => handleDelete(householdId, category.id)} aria-label={`Delete ${category.name}`} />
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No categories yet. Add your first category to start organizing
          transactions.
        </div>
      )}
    </div>
  );
}
