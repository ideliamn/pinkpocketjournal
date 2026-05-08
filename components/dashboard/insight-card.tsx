"use client";

export default function InsightCard() {
  return (
    <div className="bg-gradient-to-br from-rose-300 via-pink-300 to-orange-200 text-white rounded-3xl p-6 shadow-lg">
      <h2 className="font-bold text-xl mb-4">
        Insight Hari Ini ✨
      </h2>

      <div className="space-y-3 text-sm">
        <p>
          💸 Kategori paling boros:
          <span className="font-bold">
            {" "}Food & Drink
          </span>
        </p>

        <p>
          📈 Pengeluaran naik
          <span className="font-bold">
            {" "}12%
          </span>
          dibanding minggu lalu
        </p>

        <p>
          🥤 Kamu beli kopi 8x minggu ini ☕
        </p>
      </div>
    </div>
  );
}