import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 201
    let data: any = {}
    try {
        const body = await req.json();

        const username = body.username;
        const name = body.name;
        const email = body.email;
        const password = body.password;

        if (!username || !name || !email || !password) {
            code = 0;
            message = "Missing required fields";
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkEmail, error: checkEmailError } =
            await supabase.from("users").select("*").eq("email", email);

        if (checkEmail && checkEmail.length > 0) {
            code = 0;
            message = "Email already exist";
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: authData, error: authError } =
            await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            });

        data = authData

        if (authError) {
            code = 0;
            message = authError.message;
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        // let avatarUrl: string | null = null;

        // if (avatar) {
        //     const buffer = Buffer.from(await avatar.arrayBuffer());
        //     const filename = `${authData.user.id}-${Date.now()}-${avatar.name}`;

        //     const { error: uploadError } = await supabase.storage
        //         .from("avatar")
        //         .upload(filename, buffer, {
        //             contentType: avatar.type,
        //         });

        //     if (uploadError) {
        //         return NextResponse.json(
        //             { error: uploadError.message },
        //             { status: 400 }
        //         );
        //     }

        //     const {
        //         data: { publicUrl },
        //     } = supabase.storage.from("avatar").getPublicUrl(filename);

        //     avatarUrl = publicUrl;
        // }

        const { error: userError } = await supabase.from("users").insert([
            {
                username: username,
                email: email,
                name: name,
                id_auth: authData.user.id
            },
        ]);

        if (userError) {
            code = 0;
            message = userError.message;
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err) {
        console.error("Register API error:", err);
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}
