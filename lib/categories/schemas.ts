import { z } from "zod";

import { CATEGORY_NAME_MAX_LENGTH } from "./constants";

export const categoryTypeSchema = z.enum(["income", "expense"]);

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required")
  .max(
    CATEGORY_NAME_MAX_LENGTH,
    `Category name must be at most ${CATEGORY_NAME_MAX_LENGTH} characters`,
  );

export const addCategoryInputSchema = z.object({
  name: categoryNameSchema,
  type: categoryTypeSchema,
});

export const updateCategoryInputSchema = z.object({
  name: categoryNameSchema,
});

export type AddCategoryInput = z.infer<typeof addCategoryInputSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;
