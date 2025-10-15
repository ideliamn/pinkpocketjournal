import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkExistingPeriod(userId: number, startDate: string, endDate: string) {
    let status = 0;
    let message = "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
        message = "end date should greater than start date!"
        return { status, message }
    }

    const { data: existingPeriods, error } = await supabase
        .from("periods")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        message = error.message;
        return { status, message };
    }

    const isOverlapping = existingPeriods.some((p) => {
        const existingStart = new Date(p.start_date);
        const existingEnd = new Date(p.end_date);
        return start <= existingEnd && end >= existingStart;
    });

    if (isOverlapping) {
        message = "selected period overlaps with an existing period!";
        return { status, message };
    }

    status = 1;
    message = "success"
    return { status, message }
}