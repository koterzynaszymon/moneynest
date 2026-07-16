"use server";
import { createClient } from "../supabase/server";
import { Response } from "../types/errors";
import {
    requireAccessibleTransaction,
    requireCategoryInHousehold,
    requireHouseholdMember,
    requireUserId,
    validateTransactionInput,
} from "./guards";

export async function addTransaction(householdId: string, categoryId: string, amount: number, description: string, transactionDate: string): Promise<Response> {
    const supabase = await createClient();
    const user = await requireUserId();
    if (!user.success) return user;

    const input = validateTransactionInput(amount, transactionDate);
    if (!input.success) return input;
    
    const category = await requireCategoryInHousehold(categoryId, householdId);
    if (!category.success) return category;

    const membership = await requireHouseholdMember(householdId, user.data);
    if (!membership.success) return membership;


    const {data, error} = await supabase.from("transactions").insert({
        household_id: householdId,
        category_id: categoryId,
        amount: amount,
        description: description,
        created_by: user.data,
        transaction_date: transactionDate,
    }).select().single();
    if (error) {
        return { success: false, message: error.message } as Response;
    }
    return { success: true, data: data } as Response;
}

export async function updateTransaction(transactionId: string, categoryId: string, amount: number, description: string, transactionDate: string): Promise<Response> {
    const supabase = await createClient();
    const user = await requireUserId();
    if (!user.success) return user;

    const input = validateTransactionInput(amount, transactionDate);
    if (!input.success) return input;

    const transaction = await requireAccessibleTransaction(transactionId, user.data);
    if (!transaction.success) return transaction;

    const category = await requireCategoryInHousehold(categoryId, transaction.data.household_id);
    if (!category.success) return category;

    const {data, error} = await supabase.from("transactions").update({
        category_id: categoryId,
        amount: amount,
        description: description,
        transaction_date: transactionDate,
        updated_at: new Date().toISOString(),
    }).eq("id", transactionId).select().single();
    if (error) {
        return { success: false, message: error.message } as Response;
    }

    return { success: true, data: data } as Response;
}

export async function deleteTransaction(transactionId: string): Promise<Response> {
    const supabase = await createClient();
    const user = await requireUserId();
    if (!user.success) return user;

    const transaction = await requireAccessibleTransaction(transactionId, user.data);
    if (!transaction.success) return transaction;

    const {error} = await supabase.from("transactions").delete().eq("id", transactionId);
    if (error) {
        return { success: false, message: error.message } as Response;
    }
    
    return { success: true, data: transactionId } as Response;
}