import { Card } from "@/components/ui/card";

export default function CategoryChart({ data }: any) {
  return (
    <Card>
      <h2 className="font-semibold mb-3">Top Kategori</h2>

      <div className="space-y-2">
        {data.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.category_name}</span>
            <span>Rp {item.total}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}