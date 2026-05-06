"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import CategoryChart from "@/components/dashboard/category-chart";
import ExpenseChart from "@/components/dashboard/expense-chart";
import RecentExpense from "@/components/dashboard/recent-expense";
import SummaryCard from "@/components/dashboard/summary-card";
import UpcomingBills from "@/components/dashboard/upcoming-bills";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<any>(null);
  const [dailyChart, setDailyChart] = useState<any[]>([]);
  const [categoryChart, setCategoryChart] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);

  const planId = 1; // nanti dynamic ya
  const userId = 1;

  const fetchData = async () => {
    setLoading(true);

    try {
      const [
        summaryRes,
        dailyRes,
        categoryRes,
        recentRes,
        billsRes,
      ] = await Promise.all([
        fetch(`/api/dashboard/summary-expense?planId=${planId}`),
        fetch(`/api/dashboard/daily-expense-chart?planId=${planId}`),
        fetch(`/api/dashboard/spending-by-category-chart?planId=${planId}`),
        fetch(`/api/dashboard/recent-expense?planId=${planId}`),
        fetch(`/api/dashboard/bills?userId=${userId}`),
      ]);

      const summaryData = await summaryRes.json();
      const dailyData = await dailyRes.json();
      const categoryData = await categoryRes.json();
      const recentData = await recentRes.json();
      const billsData = await billsRes.json();

      setSummary(summaryData.data?.[0] || {});
      setDailyChart(dailyData.data || []);
      setCategoryChart(categoryData.data || []);
      setRecent(recentData.data || []);
      setBills(billsData.data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <Container>
      <div className="space-y-6">

        {/* 👋 Header */}
        <div>
          <h1 className="text-xl font-semibold">
            Hi, Idelia 👋
          </h1>
          <p className="text-sm text-gray-500">
            Yuk, kelola keuanganmu hari ini
          </p>
        </div>

        {/* 💰 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Expense" value={summary.total_expense} />
          <SummaryCard title="Total Income" value={summary.total_income} />
          <SummaryCard title="Remaining" value={summary.remaining} />
          <SummaryCard title="Budget" value={summary.budget} />
        </div>

        {/* 📊 Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <ExpenseChart data={dailyChart} />
          <CategoryChart data={categoryChart} />
        </div>

        {/* 📋 Bottom */}
        <div className="grid md:grid-cols-2 gap-4">
          <RecentExpense data={recent} />
          <UpcomingBills data={bills} />
        </div>
      </div>
    </Container>
  );
}