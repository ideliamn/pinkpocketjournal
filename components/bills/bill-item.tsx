export function BillItem({ name, due }: any) {
  return (
    <div className="flex justify-between py-2">
      <span>{name}</span>
      <span className="text-red-400">{due}</span>
    </div>
  );
}