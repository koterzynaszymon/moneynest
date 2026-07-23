import { isUserInHousehold } from "../households/queries";
import { createClient } from "../supabase/server";

export type GuardResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

export async function requireUserId(): Promise<GuardResult<string>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "User not found" };
  }

  return { success: true, data: user.id };
}

export async function requireHouseholdMember(
  householdId: string,
  userId: string,
): Promise<GuardResult<null>> {
  const isMember = await isUserInHousehold(householdId, userId);

  if (!isMember) {
    return {
      success: false,
      message: "You don't have access to this household",
    };
  }

  return { success: true, data: null };
}
