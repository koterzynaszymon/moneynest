import { Wallets } from "../types/wallets";
import { createClient } from "../supabase/server";
import { requireHouseholdMember, requireUserId } from "../auth/guards";

export async function getWallets(householdId: string): Promise<Wallets[]> {
  const supabase = await createClient();
  const userId = await requireUserId();
  if (!userId.success) {
    throw new Error(userId.message);
  }
  const membership = await requireHouseholdMember(householdId, userId.data);
  if (!membership.success) {
    throw new Error(membership.message);
  }
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  } else {
    return data as Wallets[];
  }
}

export async function getWalletById(id: string): Promise<Wallets | null> {
  const supabase = await createClient();
  const userId = await requireUserId();
  if (!userId.success) {
    throw new Error(userId.message);
  }
  const membership = await requireHouseholdMember(householdId, userId.data);
  if (!membership.success) {
    throw new Error(membership.message);
  }
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("id", id);
  if (error) {
    throw error;
  } else {
    return data[0] as Wallets;
  }
}
