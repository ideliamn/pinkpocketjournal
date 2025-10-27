"use client";

import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Geist_Mono } from "next/font/google";
import { fontString } from "chart.js/helpers";
import { useEffect, useRef } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseData {
    category_name: string;
    sum_amount: number;
    percentage_bc_limit?: number | null;
    percentage_max_expense?: number | null;
}

interface ExpensePieChartProps {
    data: ExpenseData[];
}

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["200"]
})

const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
    const chartRef = useRef<any>(null);

    const colors = [
        "#60A5FA", // biru
        "#F87171", // merah
        "#FBBF24", // kuning
        "#34D399", // hijau
        "#A78BFA", // ungu
        "#FB923C", // oranye
        "#4ADE80", // hijau muda
        "#22D3EE", // cyan
    ];

    const chartData = {
        labels: data.map((d) => d.category_name),
        datasets: [
            {
                data: data.map((d) => d.sum_amount),
                font: { family: "Geist Mono" },
                backgroundColor: colors,
                borderColor: "#FFFFFF",
                borderWidth: 0.5,
                hoverOffset: 8,
            },
        ],
    };

    const options: ChartOptions<"pie"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#444",
                    font: { size: 12, family: "Geist Mono" },
                },
            },
            tooltip: {
                backgroundColor: "#fff",
                titleColor: "#FF7BAA",
                bodyColor: "#333",
                borderColor: "#FFD6E0",
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        const dataset = context.dataset;
                        const value = context.parsed || 0;
                        const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `Rp ${value.toLocaleString("id-ID")} (${percentage}%)`;
                    },
                },
                titleFont: { family: "Geist Mono" },
                bodyFont: { family: "Geist Mono" }
            },
        },
    };

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const ctx = chart.ctx;
        const originalDraw = ctx.stroke;

        ctx.stroke = function () {
            ctx.save();
            ctx.shadowColor = "rgba(255, 182, 193, 0.5)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            originalDraw.apply(this, arguments as any);
            ctx.restore();
        };
    }, []);

    return (
        <div className="w-full max-w-md mx-auto p-2">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default ExpensePieChart;
