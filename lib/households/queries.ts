"use server";

import { HouseholdWithMemberCount } from "../types/household";
import { createClient } from "../supabase/server";
import { getUserId } from "../users/queries";

type HouseholdRowWithMemberCount = Omit<HouseholdWithMemberCount, "memberCount"> & {
    household_members: { count: number }[];
};

export async function getUserHouseholds() : Promise<HouseholdWithMemberCount[]> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error("User not found");
    }

    const { data, error } = await supabase
        .from("households")
        .select(`
            id,
            name,
            owner_id,
            currency,
            created_at,
            updated_at,
            household_members(count)
        `)
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

export async function getHouseholdOwnerId(householdId: string) : Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("households")
        .select("owner_id")
        .eq("id", householdId)
        .single();
    if (error) throw error;
    return data.owner_id;
}

export async function isHouseholdOwner(householdId: string) : Promise<boolean> {
    const userId = await getUserId();
    const householdOwnerId = await getHouseholdOwnerId(householdId);
    return userId === householdOwnerId;
}