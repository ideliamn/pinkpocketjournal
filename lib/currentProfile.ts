import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCurrentProfile(
  authId: string
) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id_auth", authId)
    .single();

  return data;
}