import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkExistingPeriod(userId: number, startDate: string, endDate: string) {
    const { data: checkData, error: errorCheckData } = await supabase
        .from("periods")
        .select("*")
        .eq("user_id", userId)
        .eq("start_date", startDate)
        .eq("end_date", endDate);

    if (!checkData || checkData.length < 1) {
        return false
    }

    return true;
}