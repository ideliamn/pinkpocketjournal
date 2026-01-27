// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  let code = 1
  let message = "OK"
  let httpStatus = 200
  let data: unknown = null
  try {
    const { email, password } = await req.json();

    const { data: dataAuth, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      code = 0;
      message = error.message;
      httpStatus = 400
      return NextResponse.json({ code, message, data }, { status: httpStatus });
    }

    data = dataAuth.user
    const res = NextResponse.json({ code, message, data }, { status: httpStatus });
    const session = dataAuth.session;

    if (session) {
      res.cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      res.cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return res;
  } catch (err: unknown) {
    code = 0;
    if (err instanceof Error) {
      message = err.message;
    } else {
      message = "Something went wrong";
    };
    httpStatus = 500;
    return NextResponse.json({ code, message, data }, { status: httpStatus });
  }
}
