"use server";
import { getCategoryById } from "../categories/queries";
import { isUserInHousehold } from "../households/queries";
import { createClient } from "../supabase/server";
import { ErrorResponse } from "../types/errors";

export async function addTransaction(householdId: string, categoryId: string, amount: number, description: string, transactionDate: string): Promise<ErrorResponse> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" } as ErrorResponse;
    }

    if(!Number.isFinite(amount) || amount <= 0) {
        return { success: false, message: "Amount must be a number greater than 0" } as ErrorResponse;
    }

    const today = new Date().toISOString().slice(0, 10);
    if(!transactionDate || transactionDate > today) {
        return { success: false, message: "Transaction date must be in the past or today" } as ErrorResponse;
    }
    
    const category = await getCategoryById(categoryId);
    if (!category || category.household_id !== householdId) {
        return { success: false, message: "Category not found or you don't have access to it" } as ErrorResponse;
    }

    const isUserInHouseholdResult = await isUserInHousehold(householdId, user.id);
    if (!isUserInHouseholdResult) {
        return { success: false, message: "You don't have access to this household" } as ErrorResponse;
    };


    const {data, error} = await supabase.from("transactions").insert({
        household_id: householdId,
        category_id: categoryId,
        amount: amount,
        description: description,
        created_by: user.id,
        transaction_date: transactionDate,
    }).select().single();
    if (error) {
        return { success: false, message: error.message } as ErrorResponse;
    }
    return { success: true, data: data } as ErrorResponse;
}