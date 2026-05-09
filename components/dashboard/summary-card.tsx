"use client";

export default function SummaryCard({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-5 lg:p-6border border-pink-100 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-3 ">
        {amount}
      </h2>
    </div>
  );
}