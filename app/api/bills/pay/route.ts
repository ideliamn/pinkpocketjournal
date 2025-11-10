import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../../lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: checkBill, error: errorCheckBill } = await supabase
            .from("bills")
            .select("*")
            .eq("id", id)
            .not("paid_date", "is", null)
            .eq("status", "done")

        if (checkBill && checkBill.length > 0) {
            code = 0
            message = "Bill is already paid!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const todayDate = new Date();
        const today = todayDate.toISOString().split("T")[0];

        const updateBill = {
            paid_date: today,
            status: "done",
            updated_at: dateTimeNow()
        }

        const { data: updatedData, error } = await supabase
            .from("bills")
            .update(updateBill)
            .eq("id", id)
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
