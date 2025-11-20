import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "../../../lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    let code = 1
    let message = "OK"
    let total = 0
    let currentPage = 0
    let totalPages = 0
    let httpStatus = 200
    let data: any[] = []

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const userId = searchParams.get("userId");
        const type = searchParams.get("type");
        const search = searchParams.get("search");
        const page = Number(searchParams.get("page"));
        const limit = Number(searchParams.get("limit"));
        const offset = (page - 1) * limit;

        let query = supabase
            .from("categories")
            .select("*", { count: "exact" });

        if (id) query = query.eq("id", id);
        if (userId) query = query.eq("user_id", userId);
        if (search) query = query.ilike("name", `%${search}%`);
        if (type) query = query.eq("type", type);

        const { data: result, error, count } = await query
            .range(offset, offset + limit - 1)
            .order("name", { ascending: true });

        if (error) {
            throw new Error(error.message)
        }

        console.log("CATEGORY")
        console.log("result", JSON.stringify(result))
        console.log("!result", !result)
        console.log("result.length < 1", (result.length < 1))
        console.log("!count", !count)
        console.log("count < 1", (count < 1))

        if (!result || result.length < 1 || !count || count < 1) {
            code = 0
            message = userId ? "No category is set for this user" : "Category not found"
            httpStatus = 404
        } else {
            total = count;
            currentPage = page;
            totalPages = Math.ceil(count / limit);
            data = result
        }

        return NextResponse.json({ code, message, total, currentPage, totalPages, data }, { status: httpStatus })
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

        if (!body.user_id || !body.name) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: searchExisting, error: errorSearchExisting } = await supabase
            .from("categories")
            .select("*")
            .match({ user_id: body.user_id })
            .ilike("name", body.name)
            .single();

        if (searchExisting) {
            code = 0
            message = `Category ${body.name} already exists!`
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const insertCategory = {
            user_id: body.user_id,
            name: body.name
        }

        const { data: insertedData, error } = await supabase
            .from("categories")
            .insert([insertCategory])
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

        if (!body.id || !body.user_id || !body.name) {
            code = 0
            message = "Please input all required fields!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: searchExisting, error: errorSearchExisting } = await supabase
            .from("categories")
            .select("*")
            .match({ user_id: body.user_id })
            .ilike("name", body.name)
            .single();

        if (searchExisting) {
            code = 0
            message = `Category ${body.name} already exists!`
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const updateCategory = {
            user_id: body.user_id,
            name: body.name,
            updated_at: dateTimeNow()
        }

        const { data: updatedData, error } = await supabase
            .from("categories")
            .update([updateCategory])
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

        const { data: checkData, error: checkDataError } = await supabase.from("categories").select("*").eq("id", id);

        if (!checkData || checkData.length < 1) {
            code = 0
            message = "Category not found!"
            httpStatus = 400
            return NextResponse.json({ code, message, data }, { status: httpStatus });
        }

        const { data: deletedData, error } = await supabase.from("categories").delete().eq("id", id).single();

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


