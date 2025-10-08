import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkExpense(userId: number, budgetId: number, amount: number, categoryId?: number) {
    console.log("amount", amount)

    let response = {
        isExceeding: false,
        message: "OK"
    }

    let query = supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", userId)
        .eq("budget_id", budgetId)

    if (categoryId) { query = query.eq("category_id", categoryId); }

    const { data: dataTotalExpense, error: errorTotalExpense } = await query;

    const totalExpense = dataTotalExpense?.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0
    ) ?? 0;

    console.log("totalExpense", totalExpense)

    if (categoryId) {
        const { data: checkCategoryBudget, error: errorCheckCategory } = await supabase
            .from("budget_categories")
            .select("amount")
            .eq("budget_id", budgetId)
            .eq("category_id", categoryId)
            .single();

        const categoryLimit = checkCategoryBudget?.amount || 0;

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

    const { data: checkBudget, error: errorCheckBudget } = await supabase
        .from("budgets")
        .select("max_expense")
        .eq("id", budgetId)
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