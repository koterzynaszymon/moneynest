import type { GuardResult } from "../auth/guards";
import { requireHouseholdMember, requireUserId } from "../auth/guards";
import { getCategoryById } from "../categories/queries";
import type { Transactions } from "../types/transactions";
import { TRANSACTION_DESCRIPTION_MAX_LENGTH } from "./constants";
import { getTransactionById } from "./queries";

export { requireHouseholdMember, requireUserId };
export type { GuardResult };

export function validateTransactionInput(
  amount: number,
  transactionDate: string,
  description: string,
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

  if (description.length > TRANSACTION_DESCRIPTION_MAX_LENGTH) {
    return {
      success: false,
      message: `Description must be at most ${TRANSACTION_DESCRIPTION_MAX_LENGTH} characters`,
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

  const membership = await requireHouseholdMember(
    transaction.household_id,
    userId,
  );
  if (!membership.success) {
    return membership;
  }

  return { success: true, data: transaction };
}
