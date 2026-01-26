import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";
import { checkExistingPeriod } from "../../../lib/helpers/period";

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
        const id = searchParams.get("id");
        const search = searchParams.get("search");
        const status = searchParams.get("status");

        let query = supabase.from("periods").select("*");

        if (id) query = query.eq("id", id);
        if (userId) query = query.eq("user_id", userId);
        if (search) query = query.ilike("name", `${search}`);
        const today = new Date().toISOString().split("T")[0];
        if (status === "active") query = query.gte("end_date", today).lte("start_date", today)

        const { data: result, error } = await query;

        if (error) {
            throw new Error(error.message)
        }

        if (!result || result.length < 1) {
            code = 0
            message = "Period not found"
            httpStatus = 404
        } else {
            data = result
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

export async function POST(req: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 201
    let data: any[] = []
    try {
        const body = await req.json();

        if (!body.user_id || !body.name || !body.start_date || !body.end_date) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const start = new Date(body.start_date);
        const end = new Date(body.end_date);

        if (start > end) {
            code = 0
            message = "end date should greater than start date!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const checkExisingPeriod = await checkExistingPeriod(body.user_id, body.start_date, body.end_date)
        if (checkExisingPeriod) {
            code = 0
            message = "This period already exist!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const insertPeriod = {
            user_id: body.user_id,
            name: body.name,
            start_date: body.start_date,
            end_date: body.end_date
        }

        const { data: insertedData, error } = await supabase
            .from("periods")
            .insert([insertPeriod])
            .select();

        if (error) {
            throw new Error(error.message)
        }

        data = insertedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: unknown) {
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

export async function PUT(req: Request) {
    let code = 1
    let message = "OK"
    let httpStatus = 200
    let data: any[] = []
    try {
        const body = await req.json();

        if (!body.id || !body.user_id || !body.name || !body.start_date || !body.end_date) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const checkExisingPeriod = await checkExistingPeriod(body.user_id, body.start_date, body.end_date)
        if (checkExisingPeriod.status == 0) {
            code = 0
            message = checkExisingPeriod.message
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const updatePeriod = {
            user_id: body.user_id,
            name: body.name,
            start_date: body.start_date,
            end_date: body.end_date,
            updated_at: dateTimeNow()
        }

        const { data: updatedData, error } = await supabase
            .from("periods")
            .update(updatePeriod)
            .eq("id", body.id)
            .select();

        if (error) {
            throw new Error(error.message)
        }

        data = updatedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: unknown) {
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

        const { data: checkData } = await supabase.from("periods").select("*").eq("id", id);

        if (!checkData || checkData.length < 1) {
            code = 0
            message = "Period not found!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: deletedData, error } = await supabase.from("periods").delete().eq("id", id).single();

        if (error) {
            throw new Error(error.message)
        }

        data = deletedData

        return NextResponse.json({ code, message, data }, { status: httpStatus });
    } catch (err: unknown) {
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