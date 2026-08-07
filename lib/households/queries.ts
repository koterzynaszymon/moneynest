import { cache } from "react";

import { createClient } from "../supabase/server";
import { getUserId } from "../users/queries";
import { HouseholdWithMemberCount } from "../types/household";
import { HouseholdMemberRow, HouseholdMemberView } from "../types/user";

type HouseholdRowWithMemberCount = Omit<
  HouseholdWithMemberCount,
  "memberCount"
> & {
  household_members: { count: number }[];
};

export async function getUserHouseholds(): Promise<HouseholdWithMemberCount[]> {
  const supabase = await createClient();
  await getUserId();

  const { data, error } = await supabase
    .from("households")
    .select(
      `
            id,
            name,
            owner_id,
            currency,
            created_at,
            updated_at,
            household_members(count)
        `,
    )
    .order("created_at", { ascending: false })
    .returns<HouseholdRowWithMemberCount[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map((household) => ({
    id: household.id,
    name: household.name,
    owner_id: household.owner_id,
    currency: household.currency,
    created_at: household.created_at,
    updated_at: household.updated_at,
    memberCount: household.household_members[0]?.count ?? 0,
  }));
}

export async function getHouseholdOwnerId(
  householdId: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("households")
    .select("owner_id")
    .eq("id", householdId)
    .single();
  if (error) throw error;
  return data.owner_id;
}

export async function isHouseholdOwner(householdId: string): Promise<boolean> {
  const userId = await getUserId();
  const householdOwnerId = await getHouseholdOwnerId(householdId);
  return userId === householdOwnerId;
}

export const isUserInHousehold = cache(
  async (householdId: string, userId: string): Promise<boolean> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("household_members")
      .select("id")
      .eq("household_id", householdId)
      .eq("member_id", userId)
      .maybeSingle();
    if (error) return false;
    return data !== null;
  },
);

export async function getHouseholdById(
  householdId: string,
): Promise<HouseholdWithMemberCount | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("households")
    .select(
      `
        id,
        name,
        owner_id,
        currency,
        created_at,
        updated_at,
        household_members(count)
      `,
    )
    .eq("id", householdId)
    .returns<HouseholdRowWithMemberCount[]>()
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    owner_id: data.owner_id,
    currency: data.currency,
    created_at: data.created_at,
    updated_at: data.updated_at,
    memberCount: data.household_members[0]?.count ?? 0,
  };
}

export async function getHouseholdMembers(
  householdId: string,
): Promise<HouseholdMemberView[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("household_members")
    .select(
      `
    member_id,
    role,
    profiles (
      email,
      name,
      avatar_url
    )
  `,
    )
    .eq("household_id", householdId)
    .returns<HouseholdMemberRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map((member: HouseholdMemberRow) => ({
    user_id: member.member_id,
    role: member.role,
    email: member.profiles?.email ?? "",
    name: member.profiles?.name ?? "",
    avatar_url: member.profiles?.avatar_url ?? "",
  }));
}
