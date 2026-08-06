"use server";

import { requireHouseholdMember, requireUserId } from "../auth/guards";
import { createClient } from "../supabase/server";
import { Wallets } from "../types/wallets";
import { checkDescription, checkName } from "./guards";

type WalletActionResult =
  | {
      success: true;
      wallet: Wallets;
    }
  | {
      success: false;
      message: string;
    };

export async function createWallet(
  householdId: string,
  name: string,
  description?: string,
): Promise<WalletActionResult> {
  const supabase = await createClient();
  const userId = await requireUserId();
  if (!userId.success) {
    return { success: false, message: userId.message };
  }
  const membership = await requireHouseholdMember(householdId, userId.data);
  if (!membership.success) {
    return { success: false, message: membership.message };
  }
  const isValindName = await checkName(name);
  if (!isValindName) {
    return {
      success: false,
      message: "Name must be between 3 and 50 characters",
    };
  }
  const isValindDescription = await checkDescription(description ?? "");
  if (!isValindDescription) {
    return {
      success: false,
      message: "Description must be less than 80 characters",
    };
  }
  const { data, error } = await supabase
    .from("wallets")
    .insert({
      household_id: householdId,
      name: name,
      description: description,
    })
    .select()
    .single();
  if (error && error.code === "23505") {
    return { success: false, message: "Wallet already exists" };
  } else if (error) {
    return { success: false, message: error.message };
  } else {
    return { success: true, wallet: data as Wallets };
  }
}

type UpdateWalletActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };
export async function updateWallet(householdId: string, walletId: string, name: string, description?: string): Promise<UpdateWalletActionResult> {
  const supabase = await createClient();
  const userId = await requireUserId();
  if (!userId.success) {
    return { success: false, message: userId.message };
  }
  const membership = await requireHouseholdMember(householdId, userId.data);
  if (!membership.success) {
    return { success: false, message: membership.message };
  }
  const isValindName = await checkName(name);
  if (!isValindName) {
    return {
      success: false,
      message: "Name must be between 3 and 50 characters",
    };
  }
  const isValindDescription = await checkDescription(description ?? "");
  if (!isValindDescription) {
    return {
      success: false,
      message: "Description must be less than 80 characters",
    };
  }
  const { error } = await supabase
    .from("wallets")
    .update({
      name: name,
      description: description,
    })
    .eq("id", walletId)
    .select()
    .single();
  if (error && error.code === "23505") {
    return { success: false, message: "Wallet already exists" };
  } else if (error) {
    return { success: false, message: error.message };
  } else {
    return { success: true, message: "Wallet updated successfully" };
  }
}