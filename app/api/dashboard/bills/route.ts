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
        const userId = searchParams.get("userId")

        const { data: bills, error: errorChart } = await supabase
            .from("bills")
            .select("id, description, amount, due_date, status")
            .order("due_date", { ascending: false });

        console.log("bills: " + JSON.stringify(bills))

        if (bills && bills.length > 0) {
            const sortedBills = bills.sort((a, b) => {
                const statusOrder: Record<string, number> = { overdue: 1, pending: 2, done: 3 };
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status];
                }
                return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
            });

            data = bills
        } else {
            code = 0
            message = "Data not found"
            httpStatus = 404
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