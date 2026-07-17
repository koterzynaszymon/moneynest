"use server";

import { isUserInHousehold } from "../households/queries";
import { createClient } from "../supabase/server";
import { Budget } from "../types/budgets";
import { hasBudgetForMonth } from "./queries";

type BudgetActionResult =
  | { success: true; budget: Budget }
  | { success: false; message: string };

export async function createBudget(
  householdId: string,
  year: number,
  month: number,
  totalAmount: number,
): Promise<BudgetActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: "User not found" };
  }
  const isCorrectYear = year >= 2000 && year <= 2100;
  if (!isCorrectYear) {
    return { success: false, message: "Year must be between 2000 and 2100" };
  }
  const isCorrectMonth = month >= 1 && month <= 12;
  if (!isCorrectMonth) {
    return { success: false, message: "Month must be between 1 and 12" };
  }
  const isCorrectTotalAmount = totalAmount > 0;
  if (!isCorrectTotalAmount || !Number.isFinite(totalAmount)) {
    return {
      success: false,
      message: "Total amount must be a valid number and greater than 0",
    };
  }

  const isMember = await isUserInHousehold(householdId, user.id);
  if (!isMember) {
    return { success: false, message: "User is not a member of the household" };
  }

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
