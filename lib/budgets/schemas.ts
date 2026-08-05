import { z } from "zod";

const budgetYearSchema = z
  .number({ error: "Year must be a number" })
  .int("Year must be a whole number")
  .min(2000, "Year must be between 2000 and 2100")
  .max(2100, "Year must be between 2000 and 2100");

const budgetMonthSchema = z
  .number({ error: "Month must be a number" })
  .int("Month must be a whole number")
  .min(1, "Month must be between 1 and 12")
  .max(12, "Month must be between 1 and 12");

const positiveAmountSchema = z
  .number({ error: "Amount must be a number" })
  .finite("Amount must be a number")
  .positive("Amount must be greater than 0");

/** Shared rules for create/update monthly budget forms and Server Actions. */
export const budgetInputSchema = z.object({
  year: budgetYearSchema,
  month: budgetMonthSchema,
  totalAmount: positiveAmountSchema,
});

/** Shared rules for category limit forms and Server Actions. */
export const categoryLimitAmountSchema = z.object({
  amount: positiveAmountSchema,
});

export type BudgetInput = z.infer<typeof budgetInputSchema>;
export type CategoryLimitAmountInput = z.infer<typeof categoryLimitAmountSchema>;
