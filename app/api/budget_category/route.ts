import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("budget_categories")
        .select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const insertBudgetCategory = {
            budget_id: body.budget_id,
            category_id: body.category_id,
            amount: body.amount
        }

        const { data, error } = await supabase
            .from("budget_categories")
            .insert([insertBudgetCategory])
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

        const updateBudgetCategory = {
            budget_id: body.budget_id,
            category_id: body.category_id,
            amount: body.amount,
            updated_at: dateTimeNow
        }

        const { data, error } = await supabase
            .from("budget_categories")
            .update(updateBudgetCategory)
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


