import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";
import { checkExpense } from "../../../lib/helpers/expense";

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
        const budgetId = searchParams.get("budgetId");
        const categoryId = searchParams.get("categoryId");
        const sourceId = searchParams.get("sourceId");
        const search = searchParams.get("search");

        let query = supabase.from("expenses").select("*, budgets(periods(name)), categories(name), sources(name)");

        if (budgetId) query = query.eq("budget_id", budgetId);
        if (categoryId) query = query.eq("category_id", categoryId);
        if (id) query = query.eq("id", id);
        if (userId) query = query.eq("user_id", userId);
        if (sourceId) query = query.eq("source_id", sourceId);
        if (search) query = query.ilike("description", `${search}`);

        const { data: result, error } = await query;

        if (error) {
            throw new Error(error.message)
        }

        if (!result || result.length < 1) {
            code = 0
            message = "Expense not found"
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

        if (!body.user_id || !body.budget_id || !body.category_id || !body.description || !body.amount || !body.source_id || !body.expense_date) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const checkExpenseBudget = await checkExpense(body.user_id, body.budget_id, body.amount, body.category_id)
        if (checkExpenseBudget.isExceeding) {
            code = 0
            message = checkExpenseBudget.message
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const insertExpense = {
            user_id: body.user_id,
            budget_id: body.budget_id,
            category_id: body.category_id,
            description: body.description,
            amount: body.amount,
            source_id: body.source_id,
            expense_date: body.expense_date
        }

        const { data: insertedData, error } = await supabase
            .from("expenses")
            .insert([insertExpense])
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

        if (!body.id || !body.user_id || !body.budget_id || !body.category_id || !body.description || !body.amount || !body.source_id || !body.expense_date) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const updateExpense = {
            user_id: body.user_id,
            budget_id: body.budget_id,
            category_id: body.category_id,
            description: body.description,
            amount: body.amount,
            source_id: body.source_id,
            expense_date: body.expense_date,
            updated_at: dateTimeNow()
        }

        const { data: updatedData, error } = await supabase
            .from("expenses")
            .update(updateExpense)
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

        const { data: checkData, error: checkDataError } = await supabase.from("expenses").select("*").eq("id", id);

        if (!checkData || checkData.length < 1) {
            code = 0
            message = "Expense not found!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: deletedData, error } = await supabase.from("expenses").delete().eq("id", id).single();

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

