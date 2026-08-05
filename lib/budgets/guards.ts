import type { GuardResult } from "../auth/guards";
import { requireHouseholdMember, requireUserId } from "../auth/guards";
import { getCategoryById } from "../categories/queries";
import { createClient } from "../supabase/server";
import type { Budget } from "../types/budgets";
import { parseInput } from "../validation/parse-input";
import { budgetInputSchema, categoryLimitAmountSchema } from "./schemas";
import { hasBudgetForMonth } from "./queries";

export { requireHouseholdMember, requireUserId };
export type { GuardResult };

export function validateBudgetInput(
  year: number,
  month: number,
  totalAmount: number,
): GuardResult<null> {
  const parsed = parseInput(budgetInputSchema, { year, month, totalAmount });

  if (!parsed.success) {
    return parsed;
  }

  return { success: true, data: null };
}

export async function requireAuthorizedBudgetActor(
  householdId: string,
): Promise<GuardResult<string>> {
  const user = await requireUserId();
  if (!user.success) {
    return user;
  }

  const membership = await requireHouseholdMember(householdId, user.data);
  if (!membership.success) {
    return membership;
  }

  return { success: true, data: user.data };
}

export async function requireBudgetAbsentForMonth(
  householdId: string,
  year: number,
  month: number,
): Promise<GuardResult<null>> {
  const budgetExistsResult = await hasBudgetForMonth(householdId, year, month);

  if (!budgetExistsResult.success) {
    return { success: false, message: budgetExistsResult.message };
  }

  if (budgetExistsResult.exists) {
    return {
      success: false,
      message: "A budget already exists for this month",
    };
  }

  return { success: true, data: null };
}

export async function requireBudgetExistsForMonth(
  householdId: string,
  year: number,
  month: number,
): Promise<GuardResult<null>> {
  const budgetExistsResult = await hasBudgetForMonth(householdId, year, month);

  if (!budgetExistsResult.success) {
    return { success: false, message: budgetExistsResult.message };
  }

  if (!budgetExistsResult.exists) {
    return { success: false, message: "Budget not found for this month" };
  }

  return { success: true, data: null };
}

export function validateCategoryLimitAmount(amount: number): GuardResult<null> {
  const parsed = parseInput(categoryLimitAmountSchema, { amount });

  if (!parsed.success) {
    return parsed;
  }

  return { success: true, data: null };
}

export async function requireBudgetInHousehold(
  budgetId: string,
  householdId: string,
): Promise<GuardResult<Budget>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", budgetId)
    .eq("household_id", householdId)
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return { success: false, message: "Budget not found" };
  }

  return { success: true, data: data as Budget };
}

export async function requireExpenseCategoryInHousehold(
  categoryId: string,
  householdId: string,
): Promise<GuardResult<null>> {
  const category = await getCategoryById(categoryId);

  if (!category || category.household_id !== householdId) {
    return {
      success: false,
      message: "Category not found or you don't have access to it",
    };
  }

  if (category.type !== "expense") {
    return {
      success: false,
      message: "Only expense categories can have limits",
    };
  }

  return { success: true, data: null };
}
