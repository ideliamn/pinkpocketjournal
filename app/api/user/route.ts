import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        let query = supabase.from("users").select("*");

        if (id) query = query.eq("id", id);

        const { data: result, error } = await query;

        if (error) {
            throw new Error(error.message)
        }

        if (!result || result.length < 1) {
            code = 0
            message = "User not found"
            httpStatus = 404
        } else {
            data = result
        }

        return NextResponse.json({ code, message, data }, { status: httpStatus })
    }
    catch (err: any) {
        code = 0
        message = err.message
        httpStatus = 500
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}

export async function PUT(request: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []

    try {
        const body = await request.json();

        const username = body.username;
        const name = body.name;
        const email = body.email;
        const password = body.password;
        const idAuth = body.idAuth;

        const { data: checkEmail, error: checkEmailError } =
            await supabase.from("users").select("*").eq("email", email).neq("id_auth", idAuth);

        if (checkEmail && checkEmail.length > 0) {
            return NextResponse.json({ error: "Email already exist" }, { status: 400 });
        }

        const { data: checkUsername, error: checkUsernameError } =
            await supabase.from("users").select("*").eq("username", username).neq("id_auth", idAuth);

        if (checkUsername && checkUsername.length > 0) {
            return NextResponse.json({ error: "Username already exist" }, { status: 400 });
        }

        const param: { email?: string; password?: string } = {};

        if (email && email.trim() !== "") {
            param.email = email.trim();
        }

        if (password && password.trim() !== "") {
            param.password = password;
        }

        const { error: errorUpdateAuth } = await supabase.auth.admin.updateUserById(idAuth, param);

        if (errorUpdateAuth) {
            code = 0;
            message = errorUpdateAuth.message;
            httpStatus = 400;
            return NextResponse.json({ code, message, httpStatus, data }, { status: httpStatus });
        }

        const paramUpdate: {
            name?: string;
            username?: string;
            email?: string;
            updated_at?: string;
        } = {};

        paramUpdate.name = name;
        paramUpdate.username = username;
        paramUpdate.email = email;
        paramUpdate.updated_at = dateTimeNow();

        if (Object.keys(paramUpdate).length === 0) {
            return NextResponse.json(
                { message: "No fields to update" },
                { status: 400 }
            );
        }

        const { error: errorUpdateProfile } = await supabase
            .from("users")
            .update(paramUpdate)
            .eq("id_auth", idAuth);

        if (errorUpdateProfile) {
            code = 0;
            message = errorUpdateProfile.message;
            httpStatus = 400;
            return NextResponse.json({ code, message, httpStatus, data }, { status: httpStatus });
        }

        return NextResponse.json({ code, message, data }, { status: httpStatus })
    }
    catch (err: any) {
        code = 0
        message = err.message
        httpStatus = 500
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}