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

        const { data: dataExpenses } = await supabase
            .from("expenses")
            .select("description, expense_date, amount, categories(name)")
            .eq("plan_id", planId)
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