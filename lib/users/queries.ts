"use server";

import { createClient } from "../supabase/server";

export async function getUserId() : Promise<string> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not found");
    return user.id;
}