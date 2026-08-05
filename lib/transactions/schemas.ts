import { z } from "zod";

import { TRANSACTION_DESCRIPTION_MAX_LENGTH } from "./constants";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

/** Shared rules for create/update transaction forms and Server Actions. */
export const transactionInputSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number" })
    .finite("Amount must be a number")
    .positive("Amount must be greater than 0"),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Transaction date is required")
    .refine(
      (date) => date <= getTodayDateString(),
      "Transaction date must be in the past or today",
    ),
  description: z
    .string()
    .max(
      TRANSACTION_DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${TRANSACTION_DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
