import { Card } from "@/components/ui/card";

export default function RecentExpense({ data }: any) {
  return (
    <Card>
      <h2 className="font-semibold mb-3">Transaksi Terakhir</h2>

      <div className="space-y-2">
        {data.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <div>
              <p>{item.description}</p>
              <p className="text-gray-400 text-xs">
                {item.categories?.name}
              </p>
            </div>
            <span>Rp {item.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}