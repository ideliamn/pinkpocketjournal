import { Card } from "@/components/ui/card";

export default function UpcomingBills({ data }: any) {
  return (
    <Card>
      <h2 className="font-semibold mb-3">Upcoming Bills</h2>

      <div className="space-y-2">
        {data.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.description}</span>
            <span className="text-red-400">
              Rp {item.amount}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}