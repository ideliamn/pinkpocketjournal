"use client";

import { useEffect, useState } from "react";

import SummaryCard from "@/components/dashboard/summary-card";
import DailyExpenseChart from "@/components/dashboard/daily-expense-chart";
import CategoryPieChart from "@/components/dashboard/category-pie-chart";
import UpcomingBills from "@/components/dashboard/upcoming-bills";
import InsightCard from "@/components/dashboard/insight-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { formatRupiah } from "@/lib/helpers/format";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [dailyChart, setDailyChart] = useState<any[]>([]);
  const [categoryChart, setCategoryChart] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const [insight, setInsight] = useState({
    topCategory: "-",
    percentage: 0,
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const meRes = await fetch("/api/user/me");
      const meResult = await meRes.json();

      if (!meRes.ok || meResult.code === 0) {
        return;
      }

      const currentUser = meResult.data.user;
      const activePlan = meResult.data.currentPlan;

      setUser(currentUser);
      setCurrentPlan(activePlan);

      const dashboardRes = await fetch(`/api/dashboard/overview?userId=${currentUser.id}&planId=${activePlan.plan_id}`);
      const dashboardResult = await dashboardRes.json();

      if (!dashboardRes.ok || dashboardResult.code === 0) {
        return;
      }

      const dashboardData = dashboardResult.data;

      setSummary(dashboardData.summary);
      setDailyChart(dashboardData.dailyExpenseChart || []);
      setCategoryChart(dashboardData.categoryChart || []);
      setBills(dashboardData.bills || []);
      setRecentTransactions(dashboardData.recentExpense || []);
      setInsight({
        topCategory: dashboardData.insight?.topCategory || "-",
        percentage: dashboardData.insight?.topCategoryPercentage || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5"> <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-3xl bg-pink-100 animate-pulse" />
        ))}
      </div>
        <div className="h-72rounded-3xlbg-pink-100animate-pulse " />
      </div>
    );
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* MOBILE WELCOME */}
      <div className="lg:hidden"> <h1 className="text-2xl font-bold text-gray-800"> Hi, {user?.name} ✨ </h1>
        <p className="text-sm text-gray-500 mt-1"> Let’s track your money today 💖 </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"> <SummaryCard title="Total Plan" amount={formatRupiah(summary?.max_expense || 0)} />
        <SummaryCard title="Expense" amount={formatRupiah(summary?.total_expense || 0)} />
        <SummaryCard title="Remaining" amount={formatRupiah(summary?.remaining || 0)} />
        <SummaryCard title="Days Left" amount={currentPlan
          ? `${Math.ceil((new Date(currentPlan.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Hari`
          : "-"}
        />
      </div>

      {/* DAILY CHART */}
      <DailyExpenseChart data={dailyChart} />

      {/* CATEGORY + BILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5"> <CategoryPieChart data={categoryChart} />
        <UpcomingBills bills={bills} />
      </div>

      {/* INSIGHT */}
      <InsightCard topCategory={insight.topCategory} percentage={insight.percentage} />

      {/* RECENT */}
      <RecentTransactions data={recentTransactions} />
    </div>
  );
}