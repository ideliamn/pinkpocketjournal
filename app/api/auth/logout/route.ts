import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST() {
  let code = 1
  let message = "OK"
  let httpStatus = 200
  let data: any = {}
  try {
    await supabase.auth.signOut();

    message = "Success log out"
    const res = NextResponse.json({ code, message, data }, { status: httpStatus });

    res.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
    res.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err: any) {
    code = 0;
    message = err.message;
    httpStatus = 500;
    return NextResponse.json({ code, message, data }, { status: httpStatus });
  }
}
