export type Budget = {
  id: string;
  household_id: string;
  year: number;
  month: number; // 1–12
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type CategoryBudget = {
  id: string;
  budget_id: string;
  category_id: string;
  amount: number;
  created_at: string;
  updated_at: string;
};