import { Card } from "@/components/ui/card";

export default function ExpenseChart({ data }: any) {
  return (
    <Card>
      <h2 className="font-semibold mb-3">Pengeluaran Harian</h2>

      <div className="h-40 flex items-center justify-center text-gray-400">
        (chart nanti kita pasang recharts ya 📈)
      </div>
    </Card>
  );
}