export default function ExpensePagination({
  page,
  totalPages,
  setPage,
}: any) {
  return (
    <div className="flex justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() =>
          setPage(page - 1)
        }
      >
        Prev
      </button>

      <div className="px-4">
        {page} / {totalPages}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={() =>
          setPage(page + 1)
        }
      >
        Next
      </button>
    </div>
  );
}