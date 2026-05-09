interface Props {
  topCategory: string;
  percentage: number;
}

export default function InsightCard({
  topCategory,
  percentage,
}: Props) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-pink-500
        to-pink-400
        p-6
        text-white
      "
    >
      <div
        className="
          absolute
          -top-10
          -right-10
          h-40
          w-40
          rounded-full
          bg-white/10
        "
      />

      <div className="relative z-10">
        <h2 className="text-xl font-bold">
          Insight Hari Ini ✨
        </h2>

        <p className="mt-4 text-pink-100 leading-relaxed">
          Kamu paling banyak spending di
          kategori{" "}
          <span className="font-bold text-white">
            {topCategory}
          </span>
        </p>

        <div
          className="
            mt-5
            inline-flex
            items-center
            rounded-full
            bg-white/20
            px-4
            py-2
            backdrop-blur-sm
          "
        >
          <span className="font-semibold">
            {percentage}% dari total
            pengeluaran 💸
          </span>
        </div>
      </div>
    </div>
  );
}