import { formatRupiah } from "@/lib/helpers/format";

export function ExpenseItem({ name, amount }: any) {
  return (
    <div className="flex justify-between py-2">
      <span>{name}</span>
      <span>-{formatRupiah(amount)}</span>
    </div>
  );
}