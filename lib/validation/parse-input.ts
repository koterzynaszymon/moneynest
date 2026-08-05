import type { ZodType } from "zod";

type ParseInputResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

/** Turn Zod validation into the app's { success, message } shape. */
export function parseInput<T>(
  schema: ZodType<T>,
  input: unknown,
): ParseInputResult<T> {
  const result = schema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid input",
    };
  }

  return { success: true, data: result.data };
}
