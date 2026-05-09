export default function ExpenseCategoryTabs({
  categories,
  active,
  onChange,
}: any) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange("")}
        className={`
          px-4
          py-2
          rounded-2xl
          text-sm
          whitespace-nowrap
          transition
          ${
            active === ""
              ? "bg-pink-500 text-white"
              : "bg-white border border-pink-100"
          }
        `}
      >
        Semua
      </button>

      {categories.map((cat: any) => (
        <button
          key={cat.id}
          onClick={() =>
            onChange(cat.id)
          }
          className={`
            px-4
            py-2
            rounded-2xl
            text-sm
            whitespace-nowrap
            transition
            ${
              active == cat.id
                ? "bg-pink-500 text-white"
                : "bg-white border border-pink-100"
            }
          `}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}