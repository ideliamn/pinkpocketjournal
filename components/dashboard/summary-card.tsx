export function SummaryCard({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-lg font-semibold">{value}</h2>
    </div>
  );
}