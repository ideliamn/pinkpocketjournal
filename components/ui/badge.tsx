export function Badge({ children }: any) {
  return (
    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full">
      {children}
    </span>
  );
}