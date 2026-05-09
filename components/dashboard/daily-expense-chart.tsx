"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface Props {
  data: {
    expense_date: string;
    total_amount: number;
  }[];
}

export default function DailyExpenseChart({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    date: new Date(
      item.expense_date
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),

    amount: Number(item.total_amount),
  }));

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Pengeluaran Harian 📈
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Expense harian selama periode
        </p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="pinkGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#ec4899"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#ec4899"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="#ec4899"
              strokeWidth={3}
              fill="url(#pinkGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}