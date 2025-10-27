import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any = {}

    try {
        const { searchParams } = new URL(request.url);
        const budgetId = searchParams.get("budgetId");

        console.log("budgetId: ", budgetId)

        const { data: dataSummary, error: errorSummary } = await supabase
            .rpc("summary_expense_category", { p_budget_id: Number(budgetId) })

        console.log("dataSummary: " + JSON.stringify(dataSummary))

        if (!dataSummary && dataSummary.length < 1) {
            code = 0
            message = "Expense not found"
            httpStatus = 404
        } else {
            data = dataSummary
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