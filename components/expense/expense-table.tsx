import { formatRupiah } from "@/lib/helpers/format";

export default function ExpenseTable({
  data,
}: any) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-pink-100
        overflow-hidden
      "
    >
      <table className="w-full">
        <thead
          className="
            bg-pink-50
            text-left
          "
        >
          <tr>
            <th className="p-4 text-sm">
              Tanggal
            </th>

            <th className="p-4 text-sm">
              Deskripsi
            </th>

            <th className="p-4 text-sm">
              Kategori
            </th>

            <th className="p-4 text-sm">
              Sumber
            </th>

            <th className="p-4 text-sm">
              Jumlah
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item: any) => (
            <tr
              key={item.id}
              className="border-t border-pink-50"
            >
              <td className="p-4 text-sm">
                {item.expense_date}
              </td>

              <td className="p-4 text-sm">
                {item.description}
              </td>

              <td className="p-4 text-sm">
                {
                  item.categories
                    ?.name
                }
              </td>

              <td className="p-4 text-sm">
                {item.sources?.name}
              </td>

              <td className="p-4 text-sm font-semibold">
                {formatRupiah(
                  item.amount
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}