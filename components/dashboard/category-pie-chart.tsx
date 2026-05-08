"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#ec4899",
  "#f472b6",
  "#f9a8d4",
  "#fbcfe8",
  "#fce7f3",
];

export default function CategoryPieChart({
  data,
}: any) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-lg">
          Top Categories 💸
        </h2>
      </div>

      <div className="h-[220px] lg:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              outerRadius={90}
            >
              {data.map((_: any, index: number) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}