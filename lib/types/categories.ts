export type Category = {
    id: string;
    household_id: string;
    name: string;
    type: "income" | "expense";
    created_at: string;
    updated_at: string;
}

export type DeleteCategoryResult =
  | { success: true }
  | { success: false; message: string };