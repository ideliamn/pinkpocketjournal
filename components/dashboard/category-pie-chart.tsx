"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  data: {
    name: string;
    total_amount: number;
    percentage: number;
  }[];
}

const COLORS = [
  "#ec4899",
  "#f472b6",
  "#f9a8d4",
  "#fbcfe8",
  "#fce7f3",
];

export default function CategoryPieChart({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: Number(item.total_amount),
    percentage: item.percentage,
  }));

  return (
    <div className=" rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Top Categories 🍰
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Kategori pengeluaran terbesar
        </p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-3">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length], }} />
              <span className="text-gray-700">
                {item.name}
              </span>
            </div>

            <span className="font-semibold text-gray-800">
              {item.percentage}%
            </span>
          </div>
        )
        )}
      </div>
    </div>
  );
}