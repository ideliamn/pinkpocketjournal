import { Card } from "@/components/ui/card";

export default function SummaryCard({ title, value }: any) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold">
        Rp {value?.toLocaleString("id-ID") || 0}
      </h2>
    </Card>
  );
}