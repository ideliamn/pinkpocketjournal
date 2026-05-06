export function IncomeItem({ name, amount }: any) {
  return (
    <div className="flex justify-between py-2 text-green-600">
      <span>{name}</span>
      <span>+Rp {amount}</span>
    </div>
  );
}