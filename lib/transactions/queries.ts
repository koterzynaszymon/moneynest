"use server";

import { createClient } from "../supabase/server";
import type { Transactions } from "../types/transactions";

type GetTransactionsResult = {
  transactions: Transactions[];
  totalPages: number;
};

type TransactionTypeFilter = "all" | "expense" | "income";
type TransactionSort = "date" | "amount";
type TransactionOrder = "asc" | "desc";
export async function getTransactions(
  householdId: string,
  page = 1,
  pageSize = 10,
  type: TransactionTypeFilter = "all",
  sort: TransactionSort = "date",
  order: TransactionOrder = "desc",
): Promise<GetTransactionsResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const orderBy = sort === "amount" ? "amount" : "transaction_date";
  const ascending = order === "asc";
  
  let query = supabase
    .from("transactions")
    .select("*, categories!inner(type)", { count: "exact" })
    .eq("household_id", householdId);
  if (type !== "all") {
    query = query.eq("categories.type", type);
  }

  const orderedQuery =
    sort === "date"
      ? query
          .order(orderBy, { ascending })
          .order("created_at", { ascending })
          .order("id", { ascending })
      : query
          .order(orderBy, { ascending })
          .order("transaction_date", { ascending: false })
          .order("created_at", { ascending: false })
          .order("id", { ascending: false });

  const { data, count, error } = await orderedQuery.range(from, to);
  if (error) {
    throw new Error(error.message);
  }
  return {
    transactions: (data ?? []).map(
      ({ categories: _category, ...transaction }) => transaction,
    ) as Transactions[],
    totalPages: Math.max(Math.ceil((count ?? 0) / pageSize), 1),
  };
}

export async function getTransactionById(
  transactionId: string,
): Promise<Transactions> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as Transactions;
}
