"use client";

import { CalendarDays, Pencil, PiggyBank, Tags } from "lucide-react";
import { Amount } from "@/components/ui/amount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/types/categories";
import { useState } from "react";
import { saveBudget, setCategoryLimit } from "@/lib/budgets/actions";
import { toast } from "sonner";
import type { Budget, CategoryBudget } from "@/lib/types/budgets";

type BudgetsBodyProps = {
  householdId: string;
  currency: string;
  expenseCategories: Category[];
  currentMonthBudget: Budget | null;
  initialCategoryBudgets: CategoryBudget[];
};

export function BudgetsBody({
  householdId,
  currency,
  expenseCategories,
  currentMonthBudget,
  initialCategoryBudgets,
}: BudgetsBodyProps) {
  const currentMonth = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const now = new Date();
  const [month, setMonth] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthNumber = Number(monthStr);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [visibleCurrentMonthBudget, setVisibleCurrentMonthBudget] =
    useState<Budget | null>(currentMonthBudget);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(
    initialCategoryBudgets,
  );
  const [limitDrafts, setLimitDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      initialCategoryBudgets.map((categoryBudget) => [
        categoryBudget.category_id,
        String(categoryBudget.amount),
      ]),
    ),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditingCurrentMonthBudget, setIsEditingCurrentMonthBudget] =
    useState<boolean>(false);
  function handleEditCurrentMonthBudget() {
    if (!visibleCurrentMonthBudget) {
      return;
    }

    setMonth(
      `${visibleCurrentMonthBudget.year}-${String(
        visibleCurrentMonthBudget.month,
      ).padStart(2, "0")}`,
    );
    setTotalAmount(visibleCurrentMonthBudget.total_amount);
    setIsEditingCurrentMonthBudget(true);
    window.setTimeout(() => setIsEditingCurrentMonthBudget(false), 200);
    window.setTimeout(() => setIsEditingCurrentMonthBudget(true), 500);
    window.setTimeout(() => setIsEditingCurrentMonthBudget(false), 700);
  }

  async function handleSubmitMonthlyBudget(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    try {
      setError(null);
      if (year < 2000 || year > 2100) {
        setError("Year must be between 2000 and 2100");
        return;
      }
      if (monthNumber < 1 || monthNumber > 12) {
        setError("Month must be between 1 and 12");
        return;
      }
      if (totalAmount <= 0) {
        setError("Total amount must be greater than 0");
        return;
      }
      setIsLoading(true);
      const result = await saveBudget(
        householdId,
        year,
        monthNumber,
        totalAmount,
      );
      if (result.success) {
        toast.success(
          result.operation === "created"
            ? "Budget created successfully"
            : "Budget updated successfully",
        );
        if (visibleCurrentMonthBudget?.id !== result.budget.id) {
          setCategoryBudgets([]);
          setLimitDrafts({});
        }
        setVisibleCurrentMonthBudget(result.budget);
        setTotalAmount(0);
        setMonth(
          `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        );
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to save budget");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetCategoryLimit(categoryId: string) {
    if (!visibleCurrentMonthBudget) {
      toast.error("Create a monthly budget first");
      return;
    }

    const amount = Number(limitDrafts[categoryId]);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a limit greater than 0");
      return;
    }

    try {
      setSavingCategoryId(categoryId);
      const result = await setCategoryLimit(
        householdId,
        visibleCurrentMonthBudget.id,
        categoryId,
        amount,
      );

      if (result.success) {
        setCategoryBudgets((previous) => {
          const existingIndex = previous.findIndex(
            (categoryBudget) => categoryBudget.category_id === categoryId,
          );

          if (existingIndex >= 0) {
            const next = [...previous];
            next[existingIndex] = result.categoryBudget;
            return next;
          }

          return [...previous, result.categoryBudget];
        });
        toast.success("Category limit saved");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to save category limit");
    } finally {
      setSavingCategoryId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription>Budget month</CardDescription>
              <CardTitle className="text-xl">{currentMonth}</CardTitle>
            </div>
            <CalendarDays className="h-5 w-5 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription>Total budget</CardDescription>
              <CardTitle className="text-xl">
                <Amount
                  value={visibleCurrentMonthBudget?.total_amount ?? 0}
                  currency={currency}
                  tone="neutral"
                />
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {visibleCurrentMonthBudget ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Edit current month budget"
                  onClick={handleEditCurrentMonthBudget}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : null}
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription>Expense categories</CardDescription>
              <CardTitle className="text-xl">
                {expenseCategories.length}
              </CardTitle>
            </div>
            <Tags className="h-5 w-5 text-primary" />
          </CardHeader>
        </Card>
      </section>

      <Card
        className={
          isEditingCurrentMonthBudget
            ? "border-red-500 ring-2 ring-red-500/30 transition-all"
            : "transition-all"
        }
      >
        <CardHeader>
          <CardTitle>Monthly budget setup</CardTitle>
          <CardDescription>
            This frontend shell shows the fields the budget action will save in
            the next step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
            onSubmit={handleSubmitMonthlyBudget}
          >
            <div className="space-y-2">
              <Label htmlFor="budget-month">Month</Label>
              <Input
                id="budget-month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-budget">Total budget</Label>
              <Input
                id="total-budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save budget"}
            </Button>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category limits</CardTitle>
          <CardDescription>
            Set optional monthly limits for expense categories. They do not need
            to exactly match the total budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!visibleCurrentMonthBudget ? (
            <div className="mb-4 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              Create a monthly budget for this month before setting category
              limits.
            </div>
          ) : null}
          {expenseCategories.length > 0 ? (
            <div className="space-y-3">
              {expenseCategories.map((category) => {
                const savedLimit = categoryBudgets.find(
                  (categoryBudget) =>
                    categoryBudget.category_id === category.id,
                );

                return (
                  <div
                    key={category.id}
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_180px_auto] md:items-center"
                  >
                    <div className="space-y-1">
                      <Badge variant="expense">{category.name}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {savedLimit ? (
                          <>
                            Saved limit:{" "}
                            <Amount
                              value={savedLimit.amount}
                              currency={currency}
                              tone="neutral"
                            />
                          </>
                        ) : (
                          "No limit saved yet."
                        )}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Limit amount"
                      aria-label={`${category.name} budget limit`}
                      value={limitDrafts[category.id] ?? ""}
                      disabled={!visibleCurrentMonthBudget}
                      onChange={(event) =>
                        setLimitDrafts((previous) => ({
                          ...previous,
                          [category.id]: event.target.value,
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        !visibleCurrentMonthBudget ||
                        savingCategoryId === category.id
                      }
                      onClick={() => handleSetCategoryLimit(category.id)}
                    >
                      {savingCategoryId === category.id
                        ? "Saving..."
                        : "Set limit"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Create expense categories first, then come back to assign monthly
              limits.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
