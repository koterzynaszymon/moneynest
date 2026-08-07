"use server";
import { createClient } from "../supabase/server";
import { Response } from "../types/errors";
import {
  requireAccessibleTransaction,
  requireCategoryInHousehold,
  requireHouseholdMember,
  requireUserId,
  requireWalletInHousehold,
  validateTransactionInput,
} from "./guards";

export async function addTransaction(
  householdId: string,
  categoryId: string,
  amount: number,
  description: string,
  transactionDate: string,
  walletId?: string | null,
): Promise<Response> {
  const supabase = await createClient();
  const user = await requireUserId();
  if (!user.success) return user;

  const input = validateTransactionInput(amount, transactionDate, description);
  if (!input.success) return input;

  const category = await requireCategoryInHousehold(categoryId, householdId);
  if (!category.success) return category;

  const membership = await requireHouseholdMember(householdId, user.data);
  if (!membership.success) return membership;

  const resolvedWalletId = walletId?.trim() ? walletId.trim() : null;
  if (resolvedWalletId) {
    const wallet = await requireWalletInHousehold(
      resolvedWalletId,
      householdId,
    );
    if (!wallet.success) return wallet;
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      household_id: householdId,
      category_id: categoryId,
      amount: amount,
      description: description,
      created_by: user.data,
      transaction_date: transactionDate,
      wallet_id: resolvedWalletId,
    })
    .select()
    .single();
  if (error) {
    return { success: false, message: error.message } as Response;
  }
  return { success: true, data: data } as Response;
}

export async function updateTransaction(
  transactionId: string,
  categoryId: string,
  amount: number,
  description: string,
  transactionDate: string,
  walletId?: string | null,
): Promise<Response> {
  const supabase = await createClient();
  const user = await requireUserId();
  if (!user.success) return user;

  const input = validateTransactionInput(amount, transactionDate, description);
  if (!input.success) return input;

  const transaction = await requireAccessibleTransaction(
    transactionId,
    user.data,
  );
  if (!transaction.success) return transaction;

  const category = await requireCategoryInHousehold(
    categoryId,
    transaction.data.household_id,
  );
  if (!category.success) return category;

  const resolvedWalletId = walletId?.trim() ? walletId.trim() : null;
  if (resolvedWalletId) {
    const wallet = await requireWalletInHousehold(
      resolvedWalletId,
      transaction.data.household_id,
    );
    if (!wallet.success) return wallet;
  }

  const { data, error } = await supabase
    .from("transactions")
    .update({
      category_id: categoryId,
      amount: amount,
      description: description,
      transaction_date: transactionDate,
      wallet_id: resolvedWalletId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .select()
    .single();
  if (error) {
    return { success: false, message: error.message } as Response;
  }

  return { success: true, data: data } as Response;
}

export async function deleteTransaction(
  transactionId: string,
): Promise<Response> {
  const supabase = await createClient();
  const user = await requireUserId();
  if (!user.success) return user;

  const transaction = await requireAccessibleTransaction(
    transactionId,
    user.data,
  );
  if (!transaction.success) return transaction;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId);
  if (error) {
    return { success: false, message: error.message } as Response;
  }

  return { success: true, data: transactionId } as Response;
}
