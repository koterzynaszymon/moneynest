"use server";

import { createClient } from "../supabase/server";
import type { Transactions } from "../types/transactions";

type GetTransactionsResult = {
    transactions: Transactions[];
    totalPages: number;
};

export async function getTransactions(householdId: string, page = 1, pageSize = 10): Promise<GetTransactionsResult> {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await supabase.from("transactions").select("*", { count: "exact" }).eq("household_id", householdId).order("transaction_date", { ascending: false }).order("amount", { ascending: false }).range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    return {
      transactions: data ?? [],
      totalPages: Math.max(Math.ceil((count ?? 0) / pageSize), 1),
    };
}

export async function getTransactionById(transactionId: string): Promise<Transactions> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("transactions").select("*").eq("id", transactionId).single();
    if (error) {
        throw new Error(error.message);
    }
    return data as Transactions;
}