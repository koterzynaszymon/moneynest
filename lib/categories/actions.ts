"use server";

import { requireHouseholdMember, requireUserId } from "../auth/guards";
import { createClient } from "../supabase/server";
import { Category, DeleteCategoryResult } from "../types/categories";
import { isCategoryNameUnique } from "./queries";

type AddCategoryResult =
  | { success: true; category: Category }
  | { success: false; message: string };

type UpdateCategoryResult =
  | { success: true; category: Category }
  | { success: false; message: string };

export async function addCategory(
  householdId: string,
  name: string,
  type: "income" | "expense",
): Promise<AddCategoryResult> {
  const user = await requireUserId();
  if (!user.success) {
    return user;
  }

  const membership = await requireHouseholdMember(householdId, user.data);
  if (!membership.success) {
    return membership;
  }

  const supabase = await createClient();
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      message: "Category name is required",
    };
  }

  if (!(await isCategoryNameUnique(householdId, trimmedName, type))) {
    return {
      success: false,
      message: "Category name must be unique",
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      household_id: householdId,
      name: trimmedName,
      type: type,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  if (!data) {
    return {
      success: false,
      message: "Failed to add category",
    };
  }

  return { success: true, category: data as Category };
}

export async function deleteCategory(
  householdId: string,
  categoryId: string,
): Promise<DeleteCategoryResult> {
  const user = await requireUserId();
  if (!user.success) {
    return user;
  }

  const membership = await requireHouseholdMember(householdId, user.data);
  if (!membership.success) {
    return membership;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("household_id", householdId);

  if (error) {
    return {
      success: false,
      message:
        "This category has a budget limit or transactions. Remove those first.",
    };
  }

  return { success: true };
}

export async function updateCategory(
  householdId: string,
  categoryId: string,
  name: string,
): Promise<UpdateCategoryResult> {
  const user = await requireUserId();
  if (!user.success) {
    return user;
  }

  const membership = await requireHouseholdMember(householdId, user.data);
  if (!membership.success) {
    return membership;
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      message: "Category name is required",
    };
  }

  const supabase = await createClient();
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, type")
    .eq("id", categoryId)
    .eq("household_id", householdId)
    .maybeSingle();

  if (categoryError) {
    return { success: false, message: categoryError.message };
  }

  if (!category) {
    return { success: false, message: "Category not found" };
  }

  if (
    !(await isCategoryNameUnique(
      householdId,
      trimmedName,
      category.type,
      categoryId,
    ))
  ) {
    return {
      success: false,
      message: "Category name must be unique",
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: trimmedName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId)
    .eq("household_id", householdId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return { success: true, category: data };
}