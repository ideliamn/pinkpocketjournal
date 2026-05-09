import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  let code = 1;
  let message = "OK";
  let httpStatus = 200;

  let data: any = null;

  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get(
      "sb-access-token"
    )?.value;

    if (!accessToken) {
      code = 0;
      message = "Unauthorized";
      httpStatus = 401;

      return NextResponse.json(
        { code, message, data },
        { status: httpStatus }
      );
    }

    // GET AUTH USER
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !authData.user) {
      code = 0;
      message = "User not found";
      httpStatus = 401;

      return NextResponse.json(
        { code, message, data },
        { status: httpStatus }
      );
    }

    // GET PROFILE
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id_auth", authData.user.id)
      .single();

    if (!profile) {
      code = 0;
      message = "Profile not found";
      httpStatus = 404;

      return NextResponse.json(
        { code, message, data },
        { status: httpStatus }
      );
    }

    // GET CURRENT PLAN
    const { data: currentPlan } = await supabase
      .rpc("get_current_period", {
        p_user_id: profile.id,
      })
      .single();

    data = {
      user: profile,
      currentPlan,
    };

    return NextResponse.json(
      { code, message, data },
      { status: httpStatus }
    );
  } catch (err: unknown) {
    code = 0;

    if (err instanceof Error) {
      message = err.message;
    } else {
      message = "Something went wrong";
    }

    httpStatus = 500;

    return NextResponse.json(
      { code, message, data },
      { status: httpStatus }
    );
  }
}