import { requireHouseholdMember, requireUserId } from "../auth/guards";
import { createClient } from "../supabase/server";
import { Wallets } from "../types/wallets";

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
  }
  return data as Wallets[];
}

export async function getWalletById(id: string): Promise<Wallets | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data as Wallets | null;
}

export async function getWalletsTransactionsAmountPerCurrentMonth(
  householdId: string,
  walletId: string,
): Promise<number> {
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
    .from("transactions")
    .select("amount")
    .eq("household_id", householdId)
    .eq("wallet_id", walletId)
    .gte(
      "transaction_date",
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ).toISOString(),
    )
    .lte(
      "transaction_date",
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      ).toISOString(),
    );

  if (error) {
    throw new Error(
      "Failed to get wallets transactions amount: " + error.message,
    );
  }
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}
