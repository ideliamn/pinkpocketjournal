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
        const planId = searchParams.get("planId");
        const categoryId = searchParams.get("categoryId");
        const userId = searchParams.get("userId");

        let query = supabase.from("category_plans").select("*, categories(id, user_id, name), plans(id, name, start_date, end_date)");

        if (planId) query = query.eq("budget_id", planId);
        if (categoryId) query = query.eq("category_id", categoryId);
        if (id) query = query.eq("id", id);

        const { data: result, error } = await query.order("created_at", { ascending: false });

        let resultFiltered = []
        if (userId && result && result.length > 0) resultFiltered = result.filter(r => r.categories?.user_id == userId);

        if (error) {
            throw new Error(error.message)
        }

        if (!result || result.length < 1 || (userId && (!resultFiltered || resultFiltered.length < 1))) {
            code = 0
            message = planId && categoryId ? "No plan is set for this category" : "Category plan not found"
            httpStatus = 404
        } else {
            data = userId ? resultFiltered : result
        }

        return NextResponse.json({ code, message, data }, { status: httpStatus })
    }
    catch (err: unknown) {
        code = 0
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = "Something went wrong";
        }
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

        if (!body.plan_id || !body.category_id || !body.amount) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkExistingBC } = await supabase.from("category_plans").select("*").eq("plan_id", body.plan_id).eq("category_id", body.category_id);
        if (checkExistingBC && checkExistingBC.length > 0) {
            code = 0
            message = "This category already have budget set for this period"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const insertBudgetCategory = {
            plan_id: body.plan_id,
            category_id: body.category_id,
            amount: body.amount
        }

        const { data: insertedData, error } = await supabase
            .from("category_plans")
            .insert([insertBudgetCategory])
            .select();

        if (error) {
            throw new Error(error.message)
        }

        data = insertedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: unknown) {
        code = 0
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = "Something went wrong";
        }
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

        if (!body.id || !body.category_id || !body.amount) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkExistingBC } = await supabase.from("category_plans").select("*").eq("plan_id", body.budget_id).eq("category_id", body.category_id);
        if (checkExistingBC && checkExistingBC.length > 0) {
            code = 0
            message = "This category already have plan set"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const updateBudgetCategory: any = {
            category_id: body.category_id,
            amount: body.amount,
            updated_at: dateTimeNow()
        };

        if (body.budget_id) {
            updateBudgetCategory.budget_id = body.budget_id;
        }

        const { data: updatedData, error } = await supabase
            .from("category_plans")
            .update(updateBudgetCategory)
            .eq("id", body.id)
            .select();

        if (error) {
            throw new Error(error.message)
        }

        data = updatedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: unknown) {
        code = 0
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = "Something went wrong";
        }
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

        const { data: checkData } = await supabase.from("category_plans").select("*").eq("id", id);

        if (!checkData || checkData.length < 1) {
            code = 0
            message = "Category plan not found!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: deletedData, error } = await supabase.from("category_plans").delete().eq("id", id).single();

        if (error) {
            throw new Error(error.message)
        }

        data = deletedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: unknown) {
        code = 0
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = "Something went wrong";
        }
        httpStatus = 500
        return NextResponse.json({ code, message, data }, { status: httpStatus });
    }
}