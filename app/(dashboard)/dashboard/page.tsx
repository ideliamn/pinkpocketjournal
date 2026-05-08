"use client";

import { useState } from "react";

import SummaryCard from "@/components/dashboard/summary-card";
import DailyExpenseChart from "@/components/dashboard/daily-expense-chart";
import CategoryPieChart from "@/components/dashboard/category-pie-chart";
import UpcomingBills from "@/components/dashboard/upcoming-bills";
import InsightCard from "@/components/dashboard/insight-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import MobileQuickAdd from "@/components/dashboard/mobile-quick-add";
import DesktopQuickAdd from "@/components/dashboard/desktop-quick-add";

import AddExpenseModal from "@/components/expense/add-expense-modal";

const chartData = [
  { date: "Mon", amount: 20000 },
  { date: "Tue", amount: 50000 },
  { date: "Wed", amount: 30000 },
  { date: "Thu", amount: 80000 },
  { date: "Fri", amount: 45000 },
];

const categoryData = [
  { category: "Food", total: 400000 },
  { category: "Transport", total: 200000 },
  { category: "Shopping", total: 150000 },
  { category: "Bills", total: 100000 },
  { category: "Other", total: 50000 },
];

const recentTransactions = [
  {
    description: "Chatime",
    amount: 35000,
    categories: {
      name: "Food",
    },
  },
  {
    description: "Gojek",
    amount: 22000,
    categories: {
      name: "Transport",
    },
  },
];

const bills = [
  {
    id: 1,
    description: "Netflix",
    amount: 54000,
    due_date: "Tomorrow",
  },
];

export default function DashboardPage() {
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* MOBILE WELCOME */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-gray-800">
          Hi, Idel ✨
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Let’s track your money today 💖
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Plan"
          amount="Rp 5.000.000"
        />

        <SummaryCard
          title="Expense"
          amount="Rp 2.500.000"
        />

        <SummaryCard
          title="Remaining"
          amount="Rp 2.500.000"
        />

        <SummaryCard
          title="Days Left"
          amount="12 Hari"
        />
      </div>

      {/* DAILY CHART */}
      <DailyExpenseChart data={chartData} />

      {/* CATEGORY + BILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategoryPieChart data={categoryData} />

        <UpcomingBills bills={bills} />
      </div>

      {/* INSIGHT */}
      <InsightCard />

      {/* RECENT TRANSACTION */}
      <RecentTransactions
        data={recentTransactions}
      />

      {/* QUICK ADD */}
      <MobileQuickAdd
        onClick={() => setOpenExpenseModal(true)}
      />

      <DesktopQuickAdd
        onClick={() => setOpenExpenseModal(true)}
      />
    </div>
  );
}