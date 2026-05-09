"use client";

import { formatRupiah } from "@/lib/helpers/format";

export default function RecentTransactions({
  data,
}: any) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-lg">
          Recent Transactions 🕒
        </h2>
      </div>

      <div className="space-y-3">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-pink-50">
            <div>
              <p className="font-medium">
                {item.description}
              </p>

              <p className="text-sm text-gray-500">
                {item.categories?.name}
              </p>
            </div>

            <p className="font-bold text-pink-500">
              {formatRupiah(item.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}