export function Select({ children, ...props }: any) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border px-4 py-3 text-sm"
    >
      {children}
    </select>
  );
}