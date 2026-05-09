"use client";

import { useEffect, useState } from "react";

import ExpenseSummary from "@/components/expense/expense-summary";
import ExpenseFilters from "@/components/expense/expense-filters";
import ExpenseCategoryTabs from "@/components/expense/expense-category-tabs";
import ExpenseTable from "@/components/expense/expense-table";
import ExpenseMobileList from "@/components/expense/expense-mobile-list";
import ExpensePagination from "@/components/expense/expense-pagination";
// import ExpenseLoading from "@/components/expense/expense-loading";
// import ExpenseEmpty from "@/components/expense/expense-empty";

export default function ExpensesPage() {
  const [loading, setLoading] =
    useState(true);

  const [user, setUser] = useState<any>(null);

  const [currentPlan, setCurrentPlan] =
    useState<any>(null);

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [summary, setSummary] =
    useState<any[]>([]);

  const [categories, setCategories] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] =
    useState(10);

  const [totalPages, setTotalPages] =
    useState(0);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const meRes = await fetch(
        "/api/user/me"
      );

      const meResult =
        await meRes.json();

      if (
        !meRes.ok ||
        meResult.code === 0
      ) {
        return;
      }

      const currentUser =
        meResult.data.user;

      const activePlan =
        meResult.data.currentPlan;

      setUser(currentUser);
      setCurrentPlan(activePlan);

      if (!activePlan) return;

      const params =
        new URLSearchParams({
          userId: String(currentUser.id),
          planId: String(
            activePlan.plan_id
          ),
          page: String(page),
          limit: String(limit),
        });

      if (search) {
        params.append(
          "search",
          search
        );
      }

      if (categoryId) {
        params.append(
          "categoryId",
          categoryId
        );
      }

      const [
        expenseRes,
        summaryRes,
        categoryRes,
      ] = await Promise.all([
        fetch(
          `/api/expense?${params.toString()}`
        ),

        fetch(
          `/api/expense/summary?planId=${activePlan.plan_id}`
        ),

        fetch("/api/category"),
      ]);

      const expenseResult =
        await expenseRes.json();

      const summaryResult =
        await summaryRes.json();

      const categoryResult =
        await categoryRes.json();

      setExpenses(
        expenseResult.data || []
      );

      setTotalPages(
        expenseResult.totalPages || 0
      );

      setSummary(
        summaryResult.data || []
      );

      setCategories(
        categoryResult.data || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, limit, categoryId]);

  if (loading) {
    // return <ExpenseLoading />;
  }

  if (!currentPlan) {
    // return <ExpenseEmpty />;
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Expenses
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Catatan pengeluaran
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <ExpenseSummary
        data={summary}
      />

      {/* FILTER */}
      <ExpenseFilters
        search={search}
        setSearch={setSearch}
        onSearch={fetchExpenses}
      />

      {/* CATEGORY */}
      <ExpenseCategoryTabs
        categories={categories}
        active={categoryId}
        onChange={setCategoryId}
      />

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <ExpenseTable
          data={expenses}
        />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <ExpenseMobileList
          data={expenses}
        />
      </div>

      {/* PAGINATION */}
      <ExpensePagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
}