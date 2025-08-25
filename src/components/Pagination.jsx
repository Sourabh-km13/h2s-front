import React from "react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  prev,
  next,
}) {
  const maxVisible = 5;
  
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const generatePages = () => {
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than maxVisible
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(2, page - halfVisible);
    let endPage = Math.min(totalPages - 1, page + halfVisible);

    // Adjust if we're near the beginning
    if (page - halfVisible < 2) {
      endPage = Math.min(totalPages - 1, maxVisible);
    }
    
    // Adjust if we're near the end
    if (page + halfVisible > totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisible + 1);
    }

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed after first page
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed before last page
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        Prev
      </button>

      {pages.map((p, index) =>
        typeof p === "string" ? (
          <span key={p} className="px-3 py-1 text-gray-400 select-none">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded-lg transition-colors ${
              page === p 
                ? "bg-indigo-600 text-white border-indigo-600" 
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={next}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        Next
      </button>
    </div>
  );
}