import { getCategoryById } from "../categories/queries";
import { isUserInHousehold } from "../households/queries";
import { createClient } from "../supabase/server";
import type { Transactions } from "../types/transactions";
import { getTransactionById } from "./queries";

type GuardResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

export async function requireUserId(): Promise<GuardResult<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return { success: true, data: user.id };
}

export function validateTransactionInput(
  amount: number,
  transactionDate: string,
): GuardResult<null> {
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      message: "Amount must be a number greater than 0",
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (!transactionDate || transactionDate > today) {
    return {
      success: false,
      message: "Transaction date must be in the past or today",
    };
  }

  return { success: true, data: null };
}

export async function requireHouseholdMember(
  householdId: string,
  userId: string,
): Promise<GuardResult<null>> {
  const isMember = await isUserInHousehold(householdId, userId);

  if (!isMember) {
    return {
      success: false,
      message: "You don't have access to this household",
    };
  }

  return { success: true, data: null };
}

export async function requireCategoryInHousehold(
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

  return { success: true, data: null };
}

export async function requireAccessibleTransaction(
  transactionId: string,
  userId: string,
): Promise<GuardResult<Transactions>> {
  let transaction: Transactions;

  try {
    transaction = await getTransactionById(transactionId);
  } catch {
    return { success: false, message: "Transaction not found" };
  }

  const membership = await requireHouseholdMember(transaction.household_id, userId);
  if (!membership.success) {
    return membership;
  }

  return { success: true, data: transaction };
}
