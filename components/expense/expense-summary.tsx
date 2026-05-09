import { formatRupiah } from "@/lib/helpers/format";

export default function ExpenseSummary({
  data,
}: any) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {data.slice(0, 4).map((item: any) => (
        <div key={item.category_name} className="bg-white rounded-3xl border border-pink-100 p-5 ">
          <p className="text-sm text-gray-500">
            {item.category_name}
          </p>

          <h2 className="mt-2 font-bold text-gray-800">
            {formatRupiah(item.sum_amount)}
          </h2>

          <p className="text-xs text-pink-500 mt-2">
            {item.percentage_cp_limit}%
          </p>
        </div>
      ))}
    </div>
  );
}