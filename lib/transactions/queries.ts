"use server";

import { createClient } from "../supabase/server";
import { Transactions } from "../types/transactions";

export async function getTransactions(householdId: string): Promise<Transactions[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase.from("transactions").select("*").eq("household_id", householdId);

    if (error) {
        throw new Error(error.message);
    }

    return data as Transactions[];
}