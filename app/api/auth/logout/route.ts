import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST() {
  let code = 1
  let message = "OK"
  let httpStatus = 200
  const data: unknown = null
  try {
    await supabase.auth.signOut();

    message = "Success log out"
    const res = NextResponse.json({ code, message, data }, { status: httpStatus });

    res.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
    res.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err: unknown) {
    code = 0;
    if (err instanceof Error) {
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = "Something went wrong";
      };
    } else {
      message = "Something went wrong";
    }
    httpStatus = 500;
    return NextResponse.json({ code, message, data }, { status: httpStatus });
  }
}
