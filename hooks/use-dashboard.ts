"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  summary: {
    total_expense: number;
    max_expense: number;
    remaining: number;
  };

  dailyExpenseChart: {
    expense_date: string;
    total_amount: number;
  }[];

  categoryChart: {
    name: string;
    total_amount: number;
    percentage: number;
  }[];

  recentExpense: {
    id: number;
    description: string;
    amount: number;
    expense_date: string;
    categories: {
      name: string;
    };
  }[];

  bills: {
    id: number;
    description: string;
    amount: number;
    due_date: string;
    status: string;
  }[];

  insight: {
    topCategory: string;
    topCategoryPercentage: number;
  };

  currentPlan: {
    id: number;
    name: string;
    max_expense: number;
    start_date: string;
    end_date: string;
  };

  daysLeft: number;
}

export default function useDashboard(
  userId?: number,
  planId?: number
) {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/dashboard/overview?userId=${userId}&planId=${planId}`
      );

      const result = await res.json();

      if (
        !res.ok ||
        result.code === 0
      ) {
        throw new Error(
          result.message ||
            "Failed load dashboard"
        );
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !planId) return;

    fetchDashboard();
  }, [userId, planId]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
}