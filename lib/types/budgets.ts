import type { Database } from "./database";

export type Budget = Database["public"]["Tables"]["budgets"]["Row"];

export type CategoryBudget =
  Database["public"]["Tables"]["category_budgets"]["Row"];