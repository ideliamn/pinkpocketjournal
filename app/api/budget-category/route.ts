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
        const budgetId = searchParams.get("budgetId");
        const categoryId = searchParams.get("categoryId");
        const userId = searchParams.get("userId");

        let query = supabase.from("budget_categories").select("*, categories(id, user_id, name), budgets(id, periods(id, name, start_date, end_date))");

        if (budgetId) query = query.eq("budget_id", budgetId);
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
            message = budgetId && categoryId ? "No budget is set for this category" : "Budget category not found"
            httpStatus = 404
        } else {
            data = userId ? resultFiltered : result
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

        if (!body.budget_id || !body.category_id || !body.amount) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkExistingBC, error: errorCheckExistingBC } = await supabase.from("budget_categories").select("*").eq("budget_id", body.budget_id).eq("category_id", body.category_id);
        if (checkExistingBC && checkExistingBC.length > 0) {
            code = 0
            message = "This category already have budget set for this period"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const insertBudgetCategory = {
            budget_id: body.budget_id,
            category_id: body.category_id,
            amount: body.amount
        }

        const { data: insertedData, error } = await supabase
            .from("budget_categories")
            .insert([insertBudgetCategory])
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

        if (!body.id || !body.category_id || !body.amount) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkExistingBC, error: errorCheckExistingBC } = await supabase.from("budget_categories").select("*").eq("budget_id", body.budget_id).eq("category_id", body.category_id);
        if (checkExistingBC && checkExistingBC.length > 0) {
            code = 0
            message = "This category already have budget set for this period"
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
            .from("budget_categories")
            .update(updateBudgetCategory)
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

        const { data: checkData, error: checkDataError } = await supabase.from("budget_categories").select("*").eq("id", id);

        if (!checkData || checkData.length < 1) {
            code = 0
            message = "Budget category not found!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: deletedData, error } = await supabase.from("budget_categories").delete().eq("id", id).single();

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