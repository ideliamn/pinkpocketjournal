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
    let data: any[] = []

    try {
        const { searchParams } = new URL(request.url);
        const planId = searchParams.get("planId")

        const { data: dataChart } = await supabase
            .rpc("spending_by_category_chart", { p_plan_id: Number(planId) })

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