"use server";

import { createClient } from "../supabase/server";
import { Budget } from "../types/budgets";
import { isUserInHousehold } from "../households/queries";

type BudgetActionResult =
  | { success: true; budget: Budget }
  | { success: false; message: string };

type BudgetExistsResult =
  | { success: true; exists: boolean }
  | { success: false; message: string };

export async function getBudget(
  householdId: string,
  year: number,
  month: number,
): Promise<BudgetActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: "User not found" };
  }

  const isMember = await isUserInHousehold(householdId, user.id);
  if (!isMember) {
    return { success: false, message: "User is not a member of the household" };
  }

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("household_id", householdId)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return { success: false, message: "Budget not found" };
  }

  return { success: true, budget: data };
}

export async function hasBudgetForMonth(
  householdId: string,
  year: number,
  month: number,
): Promise<BudgetExistsResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("budgets")
    .select("id")
    .eq("household_id", householdId)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, exists: data !== null };
}
