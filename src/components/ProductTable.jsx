import React, { useState, useMemo } from "react";

export default function ProductTable({
  products,
  addToCart,
  onView,
  onEdit,
  onDeleteRequest,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "Image", sortable: false },
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category", sortable: false },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "status", label: "Status", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // Sorting
  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const A = a[sortConfig.key];
      const B = b[sortConfig.key];
      if (A == null || B == null) return 0;
      if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
      if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Drag & drop
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("colIndex", index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = Number(e.dataTransfer.getData("colIndex"));
    if (isNaN(sourceIndex)) return;
    const next = [...columns];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    setColumns(next);
  };

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  return (
    <div className=" ">
      {/* Controls */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Search + Category */}
        <div className="flex sm:flex-row  flex-col gap-2 w-full">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name..."
            className="border px-3 py-2 rounded flex-[2]"
          />
          <div className="relative">
            <select
              className="border px-3 py-2  w-full rounded flex-[1]"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600 mt-12">
          <div className="px-2 py-1 bg-gray-100 rounded">
            Showing {(page - 1) * itemsPerPage + 1} -{" "}
            {Math.min(page * itemsPerPage, sortedProducts.length)} of{" "}
            {sortedProducts.length}
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded">
            Page {page} / {totalPages || 1}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  className={`px-2 sm:px-4 py-2 sm:py-3 ${
                    col.sortable ? "cursor-pointer" : "cursor-move"
                  } select-none`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="text-[10px] sm:text-xs">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                {columns.map((col) => {
                  if (col.key === "image") {
                    return (
                      <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-3">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-12 h-10 sm:w-14 object-cover rounded"
                        />
                      </td>
                    );
                  }
                  if (col.key === "actions") {
                    return (
                      <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex flex-wrap gap-2 items-center">
                          <button
                            onClick={() => onView(p)}
                            className="text-blue-600 hover:underline text-xs sm:text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onEdit(p)}
                            className="text-green-600 hover:underline text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteRequest(p)}
                            className="text-red-600 hover:underline text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => addToCart(p)}
                            className="bg-indigo-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </td>
                    );
                  }
                  if (col.key === "status") {
                    return (
                      <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-3">
                        <span
                          className={`px-2 py-1 text-[10px] sm:text-xs rounded ${
                            p.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    );
                  }
                  if (col.key === "price") {
                    return (
                      <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-3">
                        ₹{p.price}
                      </td>
                    );
                  }
                  return (
                    <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-3">
                      {p[col.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        {/* Prev / Next */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Load more */}
        {page < totalPages ? (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Load More
          </button>
        ) : (
          <div className="text-sm text-gray-500">All items loaded</div>
        )}
      </div>
    </div>
  );
}
