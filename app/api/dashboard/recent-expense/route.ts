import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../../lib/helpers/dateTimeNow";

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
        const budgetId = searchParams.get("budgetId")

        const { data: dataExpenses, error: errorExpenses } = await supabase
            .from("expenses")
            .select("expense_date, amount, categories(name)")
            .eq("budget_id", budgetId)
            .order("expense_date", { ascending: false })
            .limit(5)

        console.log("dataExpenses: " + JSON.stringify(dataExpenses))

        if (!dataExpenses) {
            code = 0
            message = "Data not found"
            httpStatus = 404
        } else {
            data = dataExpenses
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