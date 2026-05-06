export function SettingItem({ label }: any) {
  return (
    <div className="flex justify-between py-3 border-b">
      <span>{label}</span>
      <span>›</span>
    </div>
  );
}