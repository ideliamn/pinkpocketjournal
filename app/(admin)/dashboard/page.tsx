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
import { AlertTriangle, Clock, CreditCard, Receipt, TrendingUp, Wallet } from "lucide-react";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
});

export default function Dashboard() {
    // TYPES //
    type billStatus = "pending" | "overdue" | "done";

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
    interface SpendingBySourceChart {
        source_name: string;
        amount: number;
        percentage: number;
    }
    interface SummaryExpense {
        total_expense: number;
        max_expense: number;
        income: number;
        remaining: number;
    }
    interface RecentExpense {
        expense_date: string;
        categories: {
            name: string;
        }
        amount: number;
    }
    interface Bill {
        id: number;
        description: string;
        amount: number;
        due_date: string;
        status: billStatus;
    }

    // IMPORTS //
    const { profile } = useProfile()

    // STATES //
    const [currentPeriod, setCurrentPeriod] = useState<CurrentPeriod | null>(null);
    const [dailyExpenseChart, setDailyExpenseChart] = useState<DailyExpenseChart[] | []>([])
    const [spendingByCategoryChart, setSpendingByCategoryChart] = useState<SpendingByCategoryChart[] | []>([])
    const [spendingBySourceChart, setSpendingBySourceChart] = useState<SpendingBySourceChart[] | []>([])
    const [summaryExpense, setSummaryExpense] = useState<SummaryExpense | null>(null)
    const [recentExpense, setRecentExpense] = useState<RecentExpense[] | []>([])
    const [bill, setBill] = useState<Bill[]>([])

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
    const fetchSpendingBySourceChart = async () => {
        const getDataChart = await fetch(`/api/dashboard/spending-by-source-chart?budgetId=${currentPeriod?.data?.budget_id}`)
        const res = await getDataChart.json();
        if (res.data) {
            const dataBudget: SpendingBySourceChart[] = res.data
            console.log("dataBudget: ", dataBudget)
            setSpendingBySourceChart(dataBudget);
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
            console.log("recent expense: ", dataHistory)
            setRecentExpense(dataHistory);
        }
    }
    const fetchBills = async () => {
        const getDataBills = await fetch(`/api/dashboard/bills?userId=${profile?.id}`)
        const res = await getDataBills.json();
        if (res.data) {
            const bills = res.data
            console.log("summary bills: ", bills)
            setBill(bills);
        }
    }

    // USE EFFECTS //
    useEffect(() => {
        if (profile?.id) {
            getCurrentPeriod()
            fetchBills()
        }
    }, [profile])
    useEffect(() => {
        if (currentPeriod?.data?.budget_id) {
            fetchDailyExpenseChart();
            fetchSpendingByCategoryChart();
            fetchSpendingBySourceChart();
            fetchSummaryExpense();
            fetchRecentExpense();
        }
    }, [currentPeriod?.data?.budget_id])

    return (
        <main className="min-h-screen w-full bg-pink-50 p-6 space-y-8">
            {/* Header */}
            <div className={`${geistMono.className}`}>
                <h1 className="text-2xl font-semibold text-pink-600">welcome, {profile?.name?.split(" ")[0]}!</h1>
            </div>

            {/* Summary Cards */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${geistMono.className}`}>
                <SummaryCard icon={<Wallet className="text-green-500 w-6 h-6 mr-3" />} label="Total Budget" value={summaryExpense?.max_expense} color="green" />
                <SummaryCard icon={<CreditCard className="text-red-500 w-6 h-6 mr-3" />} label="Total Expense" value={summaryExpense?.total_expense} color="red" />
                <SummaryCard icon={<TrendingUp className="text-blue-500 w-6 h-6 mr-3" />} label="Remaining" value={summaryExpense?.remaining} color="blue" />
            </div>

            {/* daily expense chart */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 text-s ${geistMono.className}`}>
                <ChartCard title="daily expense chart">
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={dailyExpenseChart}>
                            <defs>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="expense_date" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="total_amount"
                                stroke="#FF6384"
                                fill="url(#colorExpense)"
                                name="expense"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* spending by source chart */}
                {/* <ChartCard title="spending by source">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={spendingBySourceChart}
                                dataKey="percentage"
                                nameKey="source_name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={(entry) => entry.name}
                            >
                                {spendingBySourceChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard> */}

                {/* upcoming bills */}
                <div className="max-h-250 bg-white overflow-y-auto">
                    <h2 className="text-pink-600 font-semibold flex items-center gap-2">
                        <Receipt className="w-5 h-5 mx-5 my-5 text-pink-500" /> upcoming bills
                    </h2>
                    {bill.map((b) => (
                        <div
                            key={b.id}
                            className={`flex justify-between items-center rounded-lg p-3 mx-5 my-3 px-2 m hover:shadow-sm transition ${b.status === "overdue" ? "bg-red-200" : b.status === "pending" ? "bg-yellow-200" : "bg-green-200"}`}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-800">{b.description}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 mx-1 text-gray-400" />
                                    {new Date(b.due_date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col items-end justify-end">
                                <span className={`text-sm font-medium py-1 ${b.status === "overdue" ? "text-red-500" : b.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>{b.status}</span>
                                <span className={`text - sm font - semibold`}>
                                    {formatRupiah(b.amount)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar per Category */}
            <div className={`bg - white rounded - 2xl p - 6 shadow ${geistMono.className}`}>
                <h2 className="text-pink-600 font-semibold mb-4">Category Budget Progress</h2>
                <div className="space-y-4">
                    {spendingByCategoryChart.map((cat) => {
                        const used = Math.min(cat.percentage, 100);
                        return (
                            <div key={cat.name}>
                                <div className="flex justify-between mb-1">
                                    <p className="text-sm font-medium">{cat.name}</p>
                                    <p className="text-sm text-gray-500">{used.toFixed(0)}%</p>
                                </div>
                                <div className="w-full bg-pink-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${used > 90 ? "bg-red-400" : "bg-pink-500"}`} style={{ width: `${used}%` }} />
                                </div>
                                {used > 90 && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                                        <AlertTriangle className="w-4 h-4" /> Almost exceeded your limit!
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div >

            {/* Recent Expenses Table */}
            < div className={`bg-white rounded-2xl p-6 shadow ${geistMono.className}`
            }>
                <h2 className="text-pink-600 font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-pink-500" /> Recent Expenses
                </h2>
                <div className="overflow-x-auto">
                    <Table className="min-w-full text-left">
                        <TableHeader>
                            <TableRow>
                                <TableCell className="py-2 px-4 rounded-tl-lg">Date</TableCell>
                                <TableCell className="py-2 px-4">Category</TableCell>
                                <TableCell className="py-2 px-4 rounded-tr-lg">Amount</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentExpense.map((item, index) => (
                                <TableRow
                                    key={index}
                                    className={`border-spacing-2.5 text-sm ${index % 2 === 0 ? "bg-white" : "bg-pink-50"}`}
                                >
                                    <TableCell className="py-2 px-4">{item.expense_date}</TableCell>
                                    <TableCell className="py-2 px-4">{item.categories?.name}</TableCell>
                                    <TableCell className="py-2 px-4 text-pink-600 font-medium">
                                        {formatRupiah(item.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div >
        </main >
    );

    function SummaryCard({ icon, label, value, color }) {
        const colorMap = {
            green: "text-green-600",
            red: "text-red-600",
            blue: "text-blue-600",
        };
        return (
            <div className={`bg-white p-5 rounded-2xl shadow flex items-center gap ${geistMono.className}`}>
                {icon}
                <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className={`text-xl font-bold ${colorMap[color]}`}>{formatRupiah(value)}</p>
                </div>
            </div>
        );
    }

    function ChartCard({ title, children }) {
        return (
            <div className={`bg-white rounded-2xl p-5 shadow ${geistMono.className}`}>
                <h2 className="text-pink-600 font-semibold mb-4">{title}</h2>
                {children}
            </div>
        );
    }
}