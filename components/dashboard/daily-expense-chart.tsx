"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

export default function DailyExpenseChart({
  data,
}: any) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-lg">
          Pengeluaran Hari Ini 📈
        </h2>

        <p className="text-sm text-gray-500">
          Pengeluaran harian kamu
        </p>
      </div>

      <div className="h-[220px] lg:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="date" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="#ec4899"
              fill="#fbcfe8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}