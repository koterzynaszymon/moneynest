import { createClient } from "../supabase/server";
import { Category } from "../types/categories";

export async function getCategories(householdId: string): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("categories").select("*").eq("household_id", householdId);

    if(error) {
        throw new Error(error.message);
    }

    return (data ?? []) as Category[];
}

export async function isCategoryNameUnique(householdId: string, name: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").eq("household_id", householdId).eq("name", name).maybeSingle();

    if(error) {
        return false;
    }

    return data === null;
}