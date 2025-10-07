import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("periods")
        .select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const insertPeriod = {
            user_id: body.user_id,
            name: body.name,
            start_date: body.start_date,
            end_date: body.end_date
        }

        const { data, error } = await supabase
            .from("periods")
            .insert([insertPeriod])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const updatePeriod = {
            user_id: body.user_id,
            name: body.name,
            start_date: body.start_date,
            end_date: body.end_date,
            updated_at: dateTimeNow
        }

        const { data, error } = await supabase
            .from("periods")
            .update(updatePeriod)
            .eq("id", body.id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}


