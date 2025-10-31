"use client"

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { checkExistingPeriod } from "../../../lib/helpers/period";
import { checkCurrentPeriod } from "../../../lib/helpers/expense";
import moment from "moment";
import { Area, AreaChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah } from "../../../lib/helpers/format";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/tables";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
});

export default function Dashboard() {
    // VARIABLES //
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#FF99C8", "#FFC9DE", "#FFD6A5", "#B9FBC0", "#A0C4FF"];

    //  INTERFACES //
    interface CurrentPeriod {
        isExist: boolean;
        data: {
            budget_id: number;
            period_id: number;
            period_name: string;
            user_id: number;
            start_date: string;
            end_date: string;
        }
    };
    interface DailyExpenseChart {
        expense_date: string;
        amount: number;
        budgets: {
            max_expense: number;
        }
    }
    interface SpendingByCategoryChart {
        name: string;
        total_amount: number;
        percentage: number;
    }
    interface SummaryExpense {
        total_expense: number;
        income: number;
        remaining: number;
    }
    interface RecentExpense {
        expense_date: string;
        category_name: string;
        amount: number;
    }

    // IMPORTS //
    const { profile } = useProfile()

    // STATES //
    const [currentPeriod, setCurrentPeriod] = useState<CurrentPeriod | null>(null);
    const [dailyExpenseChart, setDailyExpenseChart] = useState<DailyExpenseChart[] | []>([])
    const [spendingByCategoryChart, setSpendingByCategoryChart] = useState<SpendingByCategoryChart[] | []>([])
    const [summaryExpense, setSummaryExpense] = useState<SummaryExpense | null>(null)
    const [recentExpense, setRecentExpense] = useState<RecentExpense[] | []>([])

    // FUNCTIONS //
    const getCurrentPeriod = async () => {
        const cp = await checkCurrentPeriod(Number(profile?.id)) as CurrentPeriod
        if (cp.isExist) { setCurrentPeriod(cp) }
    }
    const fetchDailyExpenseChart = async () => {
        const getDataChart = await fetch(`/api/dashboard/daily-expense-chart?budgetId=${currentPeriod?.data?.budget_id}`);
        const res = await getDataChart.json();
        if (res.data) {
            const dataBudget: DailyExpenseChart[] = res.data
            console.log("dataBudget: ", dataBudget)
            setDailyExpenseChart(dataBudget);
        }
    }
    const fetchSpendingByCategoryChart = async () => {
        const getDataChart = await fetch(`/api/dashboard/spending-by-category-chart?budgetId=${currentPeriod?.data?.budget_id}`)
        const res = await getDataChart.json();
        if (res.data) {
            const dataBudget: SpendingByCategoryChart[] = res.data
            console.log("dataBudget: ", dataBudget)
            setSpendingByCategoryChart(dataBudget);
        }
    }
    const fetchSummaryExpense = async () => {
        const getDataChart = await fetch(`/api/dashboard/summary-expense?budgetId=${currentPeriod?.data?.budget_id}`)
        const res = await getDataChart.json();
        if (res.data) {
            const dataBudget = res.data
            console.log("summary expense: ", dataBudget[0])
            setSummaryExpense(dataBudget[0]);
        }
    }
    const fetchRecentExpense = async () => {
        const getDataChart = await fetch(`/api/dashboard/recent-expense?budgetId=${currentPeriod?.data?.budget_id}`)
        const res = await getDataChart.json();
        if (res.data) {
            const dataHistory = res.data
            console.log("summary expense: ", dataHistory)
            setRecentExpense(dataHistory);
        }
    }

    // USE EFFECTS //
    useEffect(() => {
        if (profile?.id) { getCurrentPeriod() }
    }, [profile])
    useEffect(() => {
        if (currentPeriod?.data?.budget_id) {
            fetchDailyExpenseChart();
            fetchSpendingByCategoryChart();
            fetchSummaryExpense();
            fetchRecentExpense();
        }
    }, [currentPeriod?.data?.budget_id])

    return (
        <main className="px-4 py-4">
            {/* title (active period) */}
            <div className={`py-4 text-lg ${geistMono.className}`}>
                {currentPeriod?.isExist ? (
                    <div>
                        <div>current period:</div>
                        <div>{currentPeriod.data.period_name} ({moment(new Date(currentPeriod?.data?.start_date)).format("DD MMMM YYYY")} - {moment(new Date(currentPeriod?.data?.end_date)).format("DD MMMM YYYY")})</div>
                    </div>
                ) : (
                    <div>there is no period active currently</div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* chart daily expense */}
                <div className="w-full h-[400px] p-4 justify-center items-center text-center">
                    <h2 className={`text-lg font-semibold mb-4 ${geistMono.className}`}>daily expense</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyExpenseChart}>
                            <defs>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6384" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#FF6384" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="expense_date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="total_amount"
                                stroke="#FF6384"
                                fill="url(#colorExpense)"
                                name="Expense"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                {/* chart spending by category */}
                <div className={`justify-center items-center ${geistMono.className} text-center items-center`}>
                    <h2 className={`text-lg font-semibold ${geistMono.className} text-center items-center`}>spending by category</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={spendingByCategoryChart}
                                dataKey="total_amount"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                // outerRadius={120}
                                fill="#8884d8"
                                label
                            >
                                {spendingByCategoryChart.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="#fff"
                                        strokeWidth={1}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `${formatRupiah(value)}`}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* summary expenses */}
            <div className="">
                <h2 className={`text-lg font-semibold ${geistMono.className} text-start`}>summary cards</h2>
                <div className="grid grid-cols-3">
                    <div className={`w-full h-[400px] p-4 justify-center items-center text-center ${geistMono.className}`}>
                        <div>income</div>
                        <div className="font-semibold text-lg">{formatRupiah(summaryExpense?.income ?? 0)}</div>
                    </div>
                    <div className={`w-full h-[400px] p-4 justify-center items-center text-center ${geistMono.className}`}>
                        <div>total expense</div>
                        <div className="font-semibold text-lg">{formatRupiah(summaryExpense?.total_expense ?? 0)}</div>
                    </div>
                    <div className={`w-full h-[400px] p-4 justify-center items-center text-center ${geistMono.className}`}>
                        <div>remaining budget</div>
                        <div className="font-semibold text-lg">{formatRupiah(summaryExpense?.remaining ?? 0)}</div>
                    </div>
                </div >
            </div>
            {/* recent expenses */}
            <div className="">
                <h2 className={`text-lg font-semibold ${geistMono.className} text-start`}>recent expenses</h2>
                <div className={`${geistMono.className}`}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>date</TableCell>
                                <TableCell>category</TableCell>
                                <TableCell>amount</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentExpense.map((r) => (
                                <TableRow>
                                    <TableCell>{r.expense_date}</TableCell>
                                    <TableCell>{r.category_name}</TableCell>
                                    <TableCell>{r.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div >
            </div>
        </main >
    );
}