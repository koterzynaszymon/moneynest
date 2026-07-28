"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/categories/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/types/categories";
import { Loader2, Pencil, X } from "lucide-react";

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
            <EditableCategoryBadge
              key={category.id}
              householdId={householdId}
              category={category}
              categories={categories}
            />
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

function EditableCategoryBadge({
  householdId,
  category,
  categories,
}: {
  householdId: string;
  category: Category;
  categories: Category[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState(category.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const trimmedDraftName = draftName.trim();
  const isDuplicate = categories.some(
    (candidate) =>
      candidate.id !== category.id &&
      candidate.name.trim().toLowerCase() ===
        trimmedDraftName.toLowerCase() &&
      candidate.type === category.type,
  );
  const isUnchanged = trimmedDraftName === category.name;
  const isSubmitDisabled =
    !trimmedDraftName || isDuplicate || isUnchanged || isUpdating;

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsUpdating(true);
    const result = await updateCategory(
      householdId,
      category.id,
      trimmedDraftName,
    );

    if (result.success) {
      toast.success("Category updated successfully");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsUpdating(false);
  }

  async function handleDelete() {
    const confirmed = confirm(`Delete "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteCategory(householdId, category.id);

    if (result.success) {
      toast.success("Category deleted successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsDeleting(false);
  }

  return (
    <Badge
      variant={category.type === "income" ? "income" : "expense"}
      className="flex items-center justify-between gap-2 py-1 text-sm"
    >
      <span>{category.name}</span>
      <span className="flex items-center gap-1">
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (nextOpen) {
              setDraftName(category.name);
            }
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              className="rounded-sm transition-all duration-200 hover:scale-125 hover:text-foreground"
              aria-label={`Edit ${category.name}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit category</DialogTitle>
                <DialogDescription>
                  Rename this {category.type} category.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-2">
                <Label htmlFor={`category-name-${category.id}`}>Name</Label>
                <Input
                  id={`category-name-${category.id}`}
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Groceries, rent, salary..."
                />
                {isDuplicate ? (
                  <p className="text-sm text-expense">
                    This category already exists for this type.
                  </p>
                ) : null}
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitDisabled}>
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {isDeleting ? (
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-label="Deleting category"
          />
        ) : (
          <button
            type="button"
            className="rounded-sm transition-all duration-200 hover:scale-125 hover:text-red-400"
            onClick={handleDelete}
            aria-label={`Delete ${category.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </span>
    </Badge>
  );
}
