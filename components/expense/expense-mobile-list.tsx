import { formatRupiah } from "@/lib/helpers/format";

export default function ExpenseMobileList({
  data,
}: any) {
  return (
    <div className="space-y-3">
      {data.map((item: any) => (
        <div key={item.id} className="bg-white rounded-3xl border border-pink-100 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">
                {item.description}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {item.categories?.name}
              </p>
            </div>

            <p className="font-bold text-pink-500">
              {formatRupiah(item.amount)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}