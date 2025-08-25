import { useState, useMemo, useRef } from "react";

export function usePaginationCache(data, itemsPerPage = 10) {
  const [page, setPage] = useState(1);
  const cache = useRef(new Map());

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginated = useMemo(() => {
    if (cache.current.has(page)) {
      return cache.current.get(page);
    }
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slice = data.slice(start, end);
    cache.current.set(page, slice);
    return slice;
  }, [data, page, itemsPerPage]);

  return {
    page,
    totalPages,
    data: paginated,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, totalPages)),
    prev: () => setPage((p) => Math.max(p - 1, 1)),
  };
}
