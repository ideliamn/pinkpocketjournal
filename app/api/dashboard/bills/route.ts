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
        const userId = searchParams.get("userId")

        const { data: bills } = await supabase
            .from("bills")
            .select("id, description, amount, due_date, status")
            .eq("user_id", userId)
            .order("due_date", { ascending: true });

        console.log("bills: " + JSON.stringify(bills))

        if (bills && bills.length > 0) {
            bills.sort((a, b) => {
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