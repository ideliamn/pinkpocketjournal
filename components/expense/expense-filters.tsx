import { Search } from "lucide-react";

export default function ExpenseFilters({
  search,
  setSearch,
  onSearch,
}: any) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Cari pengeluaran..."
          className="
            w-full
            h-12
            rounded-2xl
            border
            border-pink-100
            bg-white
            pl-11
            pr-4
            text-sm
            outline-none
          "
        />
      </div>

      <button
        onClick={onSearch}
        className="
          h-12
          px-5
          rounded-2xl
          bg-pink-500
          text-white
          text-sm
          font-medium
          cursor-pointer
        "
      >
        Search
      </button>
    </div>
  );
}