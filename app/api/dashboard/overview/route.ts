import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  let code = 1;
  let message = "OK";
  let httpStatus = 200;

  try {
    const { searchParams } = new URL(request.url);

    const userId = Number(searchParams.get("userId"));
    const planId = Number(searchParams.get("planId"));

    /*
      SUMMARY
    */
    const { data: summaryExpense } = await supabase
      .rpc("summary_expense_dashboard", {
        p_plan_id: planId,
      });

    /*
      DAILY CHART
    */
    const { data: dailyExpenseChart } = await supabase
      .rpc("daily_expense_chart", {
        p_plan_id: planId,
      });

    /*
      CATEGORY CHART
    */
    const { data: categoryChart } = await supabase
      .rpc("spending_by_category_chart", {
        p_plan_id: planId,
      });

    /*
      RECENT EXPENSE
    */
    const { data: recentExpense } = await supabase
      .from("expenses")
      .select(`
        id,
        description,
        amount,
        expense_date,
        categories(name)
      `)
      .eq("plan_id", planId)
      .order("expense_date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      })
      .limit(3);

    /*
      BILLS
    */
    const { data: bills } = await supabase
      .rpc("bills_by_user", {
        p_user_id: userId,
      });

    /*
      CURRENT PLAN
    */
    const { data: currentPlan } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    /*
      INSIGHT
    */
    const topCategory =
      categoryChart && categoryChart.length > 0
        ? categoryChart[0]
        : null;

    /*
      DAYS LEFT
    */
    let daysLeft = 0;

    if (currentPlan?.end_date) {
      const endDate = new Date(currentPlan.end_date);
      const today = new Date();

      const diff =
        endDate.getTime() - today.getTime();

      daysLeft = Math.ceil(
        diff / (1000 * 60 * 60 * 24)
      );
    }

    return NextResponse.json(
      {
        code,
        message,
        data: {
          summary: summaryExpense?.[0] || null,
          dailyExpenseChart:
            dailyExpenseChart || [],
          categoryChart:
            categoryChart || [],
          recentExpense:
            recentExpense || [],
          bills: bills || [],
          insight: {
            topCategory:
              topCategory?.name || "-",
            topCategoryPercentage:
              topCategory?.percentage || 0,
          },
          currentPlan,
          daysLeft,
        },
      },
      {
        status: httpStatus,
      }
    );
  } catch (err: unknown) {
    code = 0;

    if (err instanceof Error) {
      message = err.message;
    } else {
      message = "Something went wrong";
    }

    httpStatus = 500;

    return NextResponse.json(
      {
        code,
        message,
      },
      {
        status: httpStatus,
      }
    );
  }
}