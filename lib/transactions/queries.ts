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
      ({ categories, ...transaction }) => {
        if (!categories) {
          return transaction;
        }

        return transaction;
      },
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

export async function getMonthlyExpenseTotal(
  householdId: string,
  year: number,
  month: number,
): Promise<number> {
  const supabase = await createClient();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, categories!inner(type)")
    .eq("household_id", householdId)
    .eq("categories.type", "expense")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}

export type WeeklyExpenseTotals = {
  labels: string[];
  values: number[];
};

export type CategoryExpenseTotals = {
  labels: string[];
  values: number[];
};

export async function getWeeklyExpenseTotals(
  householdId: string,
  year: number,
  month: number,
): Promise<WeeklyExpenseTotals> {
  const supabase = await createClient();
  const lastDay = new Date(year, month, 0).getDate();
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, transaction_date, categories!inner(type)")
    .eq("household_id", householdId)
    .eq("categories.type", "expense")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);
  if (error) {
    throw new Error(error.message);
  }
  const values = [0, 0, 0, 0];
  for (const row of data ?? []) {
    const day = Number(String(row.transaction_date).slice(8, 10));
    const weekIndex = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
    values[weekIndex] += Number(row.amount);
  }
  return {
    labels: [
      "1–7",
      "8–14",
      "15–21",
      `22–${lastDay}`,
    ],
    values,
  };
}

type CategoryExpenseRow = {
  amount: number | string;
  categories:
    | {
        id: string;
        name: string;
        type: "expense";
      }
    | {
        id: string;
        name: string;
        type: "expense";
      }[];
};

export async function getCategoryExpenseTotals(
  householdId: string,
  year: number,
  month: number,
): Promise<CategoryExpenseTotals> {
  const supabase = await createClient();
  const lastDay = new Date(year, month, 0).getDate();
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, categories!inner(id, name, type)")
    .eq("household_id", householdId)
    .eq("categories.type", "expense")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

  if (error) {
    throw new Error(error.message);
  }

  const totalsByCategory = new Map<string, { label: string; value: number }>();

  for (const row of (data ?? []) as unknown as CategoryExpenseRow[]) {
    const category = Array.isArray(row.categories)
      ? row.categories[0]
      : row.categories;

    if (!category) {
      continue;
    }

    const current = totalsByCategory.get(category.id) ?? {
      label: category.name,
      value: 0,
    };

    totalsByCategory.set(category.id, {
      label: current.label,
      value: current.value + Number(row.amount),
    });
  }

  const totals = Array.from(totalsByCategory.values()).sort(
    (a, b) => b.value - a.value,
  );

  return {
    labels: totals.map((total) => total.label),
    values: totals.map((total) => total.value),
  };
}