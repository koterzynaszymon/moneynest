import type { Database } from "./database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type DeleteCategoryResult =
  | { success: true }
  | { success: false; message: string };