import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST() {
  try {
    const cookieStore = await cookies();
    // const token = cookieStore.get("sb-access-token");

    await supabase.auth.signOut();

    const res = NextResponse.json({ message: "Success log out" });

    res.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
    res.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
