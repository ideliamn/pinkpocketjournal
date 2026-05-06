"use client";

export function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 outline-none"
    />
  );
}