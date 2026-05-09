"use client";

import { formatRupiah } from "@/lib/helpers/format";

export default function UpcomingBills({
  bills,
}: any) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-lg">
          Upcoming Bills 🧾
        </h2>
      </div>

      <div className="space-y-3">
        {bills.map((bill: any) => (
          <div key={bill.id} className="flex items-center justify-between p-4 rounded-2xl bg-pink-50">
            <div>
              <p className="font-medium">
                {bill.description}
              </p>
              <p className="text-sm text-gray-500">
                {bill.due_date}
              </p>
            </div>

            <p className="font-bold text-pink-500">
              {formatRupiah(bill.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}