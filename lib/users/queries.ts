import { createClient } from "../supabase/server";

export async function getUserId() : Promise<string> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not found");
    return user.id;
}

export async function getUserIdByEmail(email: string) : Promise<string | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (error) throw new Error("User not found");
    return data?.id ?? null;
}

export async function doesEmailExist(email: string) : Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (error) throw new Error(error.message);
    return data !== null;
}
