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
  const [priceRange, setPriceRange] = useState(""); 
  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
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

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const parsePriceRange = (range) => {
    const [min, max] = range.split("-").map((v) => Number(v.trim()));
    return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? Infinity : max };
  };

  const filteredProducts = useMemo(() => {
    const { min, max } = parsePriceRange(priceRange);
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesPrice = p.price >= min && p.price <= max;
      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && p.stock > 0) ||
        (stockFilter === "Out of Stock" && p.stock === 0);
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock &&
        matchesStatus
      );
    });
  }, [products, search, category, priceRange, stockFilter, statusFilter]);

  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const A = a[sortConfig.key];
      const B = b[sortConfig.key];
      if (A == null || B == null) return 0;
      if (typeof A === "string")
        return sortConfig.direction === "asc"
          ? A.localeCompare(B)
          : B.localeCompare(A);
      return sortConfig.direction === "asc" ? A - B : B - A;
    });
  }, [filteredProducts, sortConfig]);

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

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 Search by name..."
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[2]"
        />
        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1"
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

        <input
          type="text"
          placeholder="greater than price"
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1"
        />

        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Info */}
      <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600 mb-3">
        <div className="px-2 py-1 bg-gray-100 rounded-lg">
          Showing {(page - 1) * itemsPerPage + 1} -{" "}
          {Math.min(page * itemsPerPage, sortedProducts.length)} of{" "}
          {sortedProducts.length}
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-lg">
          Page {page} / {totalPages || 1}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No products found.
          </div>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-indigo-50 text-gray-700 uppercase">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col.key}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, i)}
                    className={`px-4 py-3 ${
                      col.sortable
                        ? "cursor-pointer hover:text-indigo-600"
                        : "cursor-move"
                    } select-none transition`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-xs">
                          {sortConfig.key === col.key
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "⇅"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  {columns.map((col) => {
                    if (col.key === "image")
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-12 h-10 sm:w-14 object-cover rounded-md border"
                          />
                        </td>
                      );
                    if (col.key === "actions")
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-4 flex flex-wrap gap-2"
                        >
                          <button
                            onClick={() => onView(p)}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onEdit(p)}
                            className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteRequest(p)}
                            className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => p.stock > 0 && addToCart(p)}
                            disabled={p.stock === 0}
                            className={`px-2 py-1 text-xs rounded text-white ${
                              p.stock === 0
                                ? "bg-gray-400"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                          >
                            Add
                          </button>
                        </td>
                      );
                    if (col.key === "status")
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              p.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      );
                    if (col.key === "stock")
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              p.stock > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                      );
                    if (col.key === "price")
                      return (
                        <td key={col.key} className="px-4 py-3 font-medium">
                          ₹{p.price}
                        </td>
                      );
                    return (
                      <td key={col.key} className="px-4 py-3">
                        {p[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {paginatedProducts.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded-lg ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
