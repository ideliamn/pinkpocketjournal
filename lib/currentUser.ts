import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCurrentUser(
  accessToken: string
) {
  const { data, error } = await supabase.auth.getUser(
    accessToken
  );

  if (error || !data.user) {
    return null;
  }

  return data.user;
}