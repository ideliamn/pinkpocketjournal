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

        const { data: dataChart, error: errorChart } = await supabase
            .rpc("spending_by_category_chart", { p_budget_id: Number(budgetId) })

        console.log("dataChart: " + JSON.stringify(dataChart))

        if (!dataChart && dataChart.length < 1) {
            code = 0
            message = "Data not found"
            httpStatus = 404
        } else {
            data = dataChart
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