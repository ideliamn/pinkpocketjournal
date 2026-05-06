"use client";

export function Chip({ label, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-sm border ${
        selected
          ? "bg-pink-500 text-white"
          : "bg-white text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}