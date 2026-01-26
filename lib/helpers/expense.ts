import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkExpense(userId: number, planId: number, amount: number, categoryId?: number) {
    console.log("amount", amount)

    const response = {
        isExceeding: false,
        message: "OK"
    }

    let query = supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", userId)
        .eq("plan_id", planId)

    if (categoryId) { query = query.eq("category_id", categoryId); }

    const { data: dataTotalExpense } = await query;

    const totalExpense = dataTotalExpense?.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0
    ) ?? 0;

    console.log("totalExpense", totalExpense)

    if (categoryId) {
        const { data: checkCategoryPlans } = await supabase
            .from("category_plans")
            .select("amount")
            .eq("plan_id", planId)
            .eq("category_id", categoryId)
            .single();

        const categoryLimit = checkCategoryPlans?.amount || 0;

        console.log("categoryLimit", categoryLimit)

        if (categoryLimit > 0 && totalExpense + amount >= categoryLimit) {
            response.isExceeding = true;
            response.message = "Budget for this category has exceed!"
            console.log("CATEGORY LIMIT")
            return response;
        }
        else {
            console.log("BELUM MELEBIHI CATEGORY LIMIT")
        }
    }

    const { data: checkBudget } = await supabase
        .from("budgets")
        .select("max_expense")
        .eq("id", planId)
        .single();

    const maxExpense = checkBudget?.max_expense || 0;

    console.log("maxExpense", maxExpense)

    if (totalExpense + amount >= maxExpense) {
        response.isExceeding = true;
        response.message = "Budget has exceed!"
        console.log("expense exceed")
        return response;
    }
    else {
        console.log("belum exceed budget")
    }

    return response;
}

export async function checkCurrentPeriod(userId: number) {
    type CurrentPeriod = {
        plan_id: number;
        plan_name: string;
        user_id: number;
        start_date: string;
        end_date: string;
    };

    const response = {
        isExist: false,
        data: {
            plan_id: 0,
            user_id: 0
        }
    }
    const { data: checkPeriod } = await supabase
        .rpc("get_current_period", { p_user_id: userId })
        .single() as { data: CurrentPeriod | null, error: any }

    console.log("checkPeriod", JSON.stringify(checkPeriod))

    if (checkPeriod) {
        response.isExist = true;
        response.data = checkPeriod
    }

    return response;
}