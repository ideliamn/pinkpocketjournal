import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const userId = searchParams.get("userId");
        const planId = searchParams.get("planId");
        const status = searchParams.get("status");

        let query = supabase.from("plans").select("*, category_plans(id, amount, categories(id, name))");

        if (userId) query = query.eq("user_id", userId);
        if (planId) query = query.eq("plan_id", planId);
        if (id) query = query.eq("id", id);

        let { data: result, error } = await query;

        if (error) {
            throw new Error(error.message)
        }

        if (status === "active" && result) {
            const today = new Date().toISOString().split("T")[0];
            result = result.filter(
                (r) =>
                    r.start_date <= today &&
                    r.end_date >= today
            );
        }

        if (!result || result.length < 1) {
            code = 0
            message = "Plan not found"
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

export async function POST(req: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 201
    let data: any[] = []

    try {
        const body = await req.json();

        if (!body.user_id || !body.name || !body.start_date || !body.end_date || !body.max_expense) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const insertPlan = {
            user_id: body.user_id,
            name: body.name,
            start_date: body.start_date,
            end_date: body.end_date,
            max_expense: body.max_expense
        }

        const { data: insertedData, error } = await supabase
            .from("plans")
            .insert([insertPlan])
            .select();

        if (error) {
            throw new Error(error.message)
        }

        data = insertedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: any) {
        code = 0
        message = err.message
        httpStatus = 500
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}

export async function PUT(req: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []

    try {
        const body = await req.json();

        if (!body.id || !body.user_id || !body.name || !body.start_date || !body.end_date || !body.max_expense) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const updatePlan = {
            user_id: body.user_id,
            name: body.name,
            start_date: body.start_date,
            end_date: body.end_date,
            max_expense: body.max_expense,
            updated_at: dateTimeNow()
        }

        const { data: updatedData, error } = await supabase
            .from("plans")
            .update(updatePlan)
            .eq("id", body.id)
            .select();

        if (error) {
            throw new Error(error.message)
        }

        data = updatedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: any) {
        code = 0
        message = err.message
        httpStatus = 500
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}

export async function DELETE(request: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            code = 0
            message = "Please input ID!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkData, error: checkDataError } = await supabase.from("plans").select("*").eq("id", id);

        if (!checkData || checkData.length < 1) {
            code = 0
            message = "Plan not found!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: deletedData, error } = await supabase.from("plans").delete().eq("id", id).single();

        if (error) {
            throw new Error(error.message)
        }

        data = deletedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: any) {
        code = 0
        message = err.message
        httpStatus = 500
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}