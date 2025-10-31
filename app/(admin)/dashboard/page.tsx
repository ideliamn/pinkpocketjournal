"use client"

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { checkExistingPeriod } from "../../../lib/helpers/period";
import { checkCurrentPeriod } from "../../../lib/helpers/expense";
import moment from "moment";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
});

export default function Dashboard() {
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

    // IMPORTS //
    const { profile } = useProfile()

    // STATES //
    const [currentPeriod, setCurrentPeriod] = useState<CurrentPeriod | null>(null);
    const [dailyExpenseChart, setDailyExpenseChart] = useState<DailyExpenseChart[] | []>([])

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

    // USE EFFECTS //
    useEffect(() => {
        if (profile?.id) {
            getCurrentPeriod()
        }
    }, [profile])
    useEffect(() => {
        if (currentPeriod?.data?.budget_id) {
            fetchDailyExpenseChart();
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
                <div className="w-full h-[400px] rounded-2xl shadow p-4">
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
                <div className={`flex justify-center items-start pt-10 ${geistMono.className}`}>
                    <div className={`text-s`}>b</div>
                </div>
            </div>
        </main>
    );
}