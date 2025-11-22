const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          hasPrev
            ? "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors min-w-[44px] ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : page === "..."
                ? "bg-transparent text-gray-500 cursor-default"
                : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          hasNext
            ? "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
