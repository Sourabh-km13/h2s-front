import { useState, useMemo, useRef, useEffect } from "react";

export function usePaginationCache(data, itemsPerPage = 10) {
  const [page, setPage] = useState(1);
  const cache = useRef(new Map());
  const dataRef = useRef(data);

  useEffect(() => {
    // Reset to page 1 when filtered data changes
    setPage(1);
    cache.current.clear();
    dataRef.current = data;
  }, [data]); // This will trigger when filtered data changes

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const paginated = useMemo(() => {
    // Ensure page is within valid range
    const currentPage = Math.min(Math.max(1, page), totalPages);

    if (cache.current.has(currentPage)) {
      return cache.current.get(currentPage);
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slice = data.slice(start, end);

    cache.current.set(currentPage, slice);
    return slice;
  }, [data, page, itemsPerPage, totalPages]);

  const setPageSafe = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return {
    page: Math.min(page, totalPages),
    totalPages,
    data: paginated,
    setPage: setPageSafe,
    next: () => setPageSafe(page + 1),
    prev: () => setPageSafe(page - 1),
  };
}
