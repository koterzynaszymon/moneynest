"use server";

import { createClient } from "../supabase/server";
import { Budget, CategoryBudget } from "../types/budgets";
import {
  requireAuthorizedBudgetActor,
  requireBudgetAbsentForMonth,
  requireBudgetExistsForMonth,
  requireBudgetInHousehold,
  requireExpenseCategoryInHousehold,
  validateBudgetInput,
  validateCategoryLimitAmount,
} from "./guards";
import { hasBudgetForMonth } from "./queries";

type BudgetActionResult =
  | { success: true; budget: Budget }
  | { success: false; message: string };

type CategoryBudgetActionResult =
  | { success: true; categoryBudget: CategoryBudget }
  | { success: false; message: string };

export async function createBudget(
  householdId: string,
  year: number,
  month: number,
  totalAmount: number,
): Promise<BudgetActionResult> {
  const input = validateBudgetInput(year, month, totalAmount);
  if (!input.success) {
    return input;
  }

  const actor = await requireAuthorizedBudgetActor(householdId);
  if (!actor.success) {
    return actor;
  }

  const budgetAbsent = await requireBudgetAbsentForMonth(
    householdId,
    year,
    month,
  );
  if (!budgetAbsent.success) {
    return budgetAbsent;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      household_id: householdId,
      year: year,
      month: month,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A budget already exists for this month",
      };
    }

    return { success: false, message: error.message };
  }

  return { success: true, budget: data as Budget };
}

export async function updateBudget(
  householdId: string,
  year: number,
  month: number,
  totalAmount: number,
): Promise<BudgetActionResult> {
  const input = validateBudgetInput(year, month, totalAmount);
  if (!input.success) {
    return input;
  }

  const actor = await requireAuthorizedBudgetActor(householdId);
  if (!actor.success) {
    return actor;
  }

  const budgetExists = await requireBudgetExistsForMonth(
    householdId,
    year,
    month,
  );
  if (!budgetExists.success) {
    return budgetExists;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .update({
      total_amount: totalAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("household_id", householdId)
    .eq("year", year)
    .eq("month", month)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, budget: data as Budget };
}

type SaveBudgetResult =
  | { success: true; budget: Budget; operation: "created" | "updated" }
  | { success: false; message: string };
export async function saveBudget(
  householdId: string,
  year: number,
  month: number,
  totalAmount: number,
): Promise<SaveBudgetResult> {
  const existsResult = await hasBudgetForMonth(householdId, year, month);
  if (!existsResult.success) {
    return { success: false, message: existsResult.message };
  }
  const result = existsResult.exists
    ? await updateBudget(householdId, year, month, totalAmount)
    : await createBudget(householdId, year, month, totalAmount);
  if (!result.success) {
    return result;
  }
  return {
    success: true,
    budget: result.budget,
    operation: existsResult.exists ? "updated" : "created",
  };
}

export async function setCategoryLimit(
  householdId: string,
  budgetId: string,
  categoryId: string,
  amount: number,
): Promise<CategoryBudgetActionResult> {
  const input = validateCategoryLimitAmount(amount);
  if (!input.success) {
    return input;
  }

  const actor = await requireAuthorizedBudgetActor(householdId);
  if (!actor.success) {
    return actor;
  }

  const budget = await requireBudgetInHousehold(budgetId, householdId);
  if (!budget.success) {
    return budget;
  }

  const category = await requireExpenseCategoryInHousehold(
    categoryId,
    householdId,
  );
  if (!category.success) {
    return category;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("category_budgets")
    .upsert(
      {
        budget_id: budgetId,
        category_id: categoryId,
        amount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "budget_id,category_id" },
    )
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, categoryBudget: data as CategoryBudget };
}