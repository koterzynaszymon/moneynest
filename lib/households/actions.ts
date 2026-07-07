"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "../supabase/server";
import { Household } from "../types/household";
import { isHouseholdOwner } from "./queries";


type CreateHouseholdResult =
  | { success: true; household: Household }
  | { success: false; message: string };

export async function createHousehold(
  name: string,
  currency: string,
): Promise<CreateHouseholdResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const trimmedName = name.trim();
  const trimmedCurrency = currency.trim();

  if (!trimmedName || trimmedName.length < 3) {
    return {
      success: false,
      message: "Household name must be at least 3 characters long",
    };
  }

  if (!trimmedCurrency) {
    return { success: false, message: "Currency is required" };
  }

  if (authError || !user) {
    return {
      success: false,
      message: "You must be logged in to create a household",
    };
  }

  const { data: household, error: householdError } = await supabase
    .from("households")
    .insert({
      name: trimmedName,
      currency: trimmedCurrency,
      owner_id: user.id,
    })
    .select()
    .single();

  if (householdError) {
    return {
      success: false,
      message: "Failed to create household. Try again later.",
    };
  }

  const { error: memberError } = await supabase
    .from("household_members")
    .insert({
      household_id: household.id,
      member_id: user.id,
      role: "owner",
    });

  if (memberError) {
    return {
      success: false,
      message: "Household was created, but failed to add owner as member.",
    };
  }

  revalidatePath("/dashboard");

  return { success: true, household };
}

export async function deleteHousehold(householdId: string) {
    const supabase = await createClient();
    const isOwner = await isHouseholdOwner(householdId);

    if (!isOwner) return {success: false, message: "You are not the owner of this household"};

    const { error: deleteError } = await supabase.from("households").delete().eq("id", householdId);

    if (deleteError) return {success: false, message: deleteError.message};

    revalidatePath("/dashboard");

    return {success: true, message: "Household deleted successfully"};
}