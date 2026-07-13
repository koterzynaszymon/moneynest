"use server";

import { createClient } from "../supabase/server";
import { Category, DeleteCategoryResult } from "../types/categories";
import { isCategoryNameUnique } from "./queries";

type AddCategoryResult =
  | { success: true; category: Category }
  | { success: false; message: string };

export async function addCategory(householdId: string, name: string, type: "income" | "expense"): Promise<AddCategoryResult> {
  const supabase = await createClient();
  const trimmedName = name.trim();

  if(!trimmedName) {
    return {
      success: false,
      message: "Category name is required",
    };
  }

  if(!await isCategoryNameUnique(householdId, trimmedName)) {
    return {
      success: false,
      message: "Category name must be unique",
    };
  }

  const { data, error } = await supabase.from("categories").insert({
    household_id: householdId,
    name: trimmedName,
    type: type,
  }).select().single();

  if(error) {
    return {
      success: false,
      message: error.message,
    };
  }
  if(!data) {
    return {
      success: false,
      message: "Failed to add category",
    };
  }

  return { success: true, category: data as Category };
}

export async function deleteCategory(householdId: string, categoryId: string): Promise<DeleteCategoryResult> {
    const supabase = await createClient();
    const { error } = await supabase.from("categories").delete().eq("id", categoryId).eq("household_id", householdId);
    if(error) {
        return {
            success: false,
            message: error.message,
        };
    }
    return { success: true };
}