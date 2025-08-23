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
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("All"); // All | In Stock | Out of Stock
  const [statusFilter, setStatusFilter] = useState("All"); // All | Active | Inactive
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

  // Categories list
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;

      const matchesPrice =
        (!priceRange.min || p.price >= Number(priceRange.min)) &&
        (!priceRange.max || p.price <= Number(priceRange.max));

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && p.stock > 0) ||
        (stockFilter === "Out of Stock" && p.stock === 0);

      const matchesStatus =
        statusFilter === "All" || p.status === statusFilter;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesStatus;
    });
  }, [products, search, category, priceRange, stockFilter, statusFilter]);

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

  return (
    <div className="">
      {/* Controls */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {/* Search */}
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="🔍 Search by name..."
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[2]"
          />

          {/* Category */}
          <select
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[1]"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Price Min */}
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[1]"
          />

          {/* Price Max */}
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[1]"
          />

          {/* Stock filter */}
          <select
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[1]"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Status filter */}
          <select
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[1]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Info */}
        <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600 mt-6">
          <div className="px-2 py-1 bg-gray-100 rounded-lg">
            Showing {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, sortedProducts.length)} of {sortedProducts.length}
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded-lg">
            Page {page} / {totalPages || 1}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-50 text-gray-700 uppercase sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  className={`px-4 py-3 ${col.sortable ? "cursor-pointer hover:text-indigo-600" : "cursor-move"} select-none transition`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-xs">
                        {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p, idx) => (
              <tr key={p.id} className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50`}>
                {columns.map((col) => {
                  if (col.key === "image") {
                    return <td key={col.key} className="px-4 py-3"><img src={p.img} alt={p.name} className="w-12 h-10 sm:w-14 object-cover rounded-md border" /></td>;
                  }
                  if (col.key === "actions") {
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 items-center">
                          <button onClick={() => onView(p)} className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600 hover:bg-blue-100">View</button>
                          <button onClick={() => onEdit(p)} className="px-2 py-1 text-xs rounded bg-green-50 text-green-600 hover:bg-green-100">Edit</button>
                          <button onClick={() => onDeleteRequest(p)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                          <button onClick={() => addToCart(p)} className="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
                        </div>
                      </td>
                    );
                  }
                  if (col.key === "status") {
                    return <td key={col.key} className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full font-medium ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.status}</span></td>;
                  }
                  if (col.key === "price") {
                    return <td key={col.key} className="px-4 py-3 font-medium">₹{p.price}</td>;
                  }
                  return <td key={col.key} className="px-4 py-3">{p[col.key]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100">Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded-lg ${page === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100">Next</button>
        </div>
        {page < totalPages ? (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Load More</button>
        ) : (
          <div className="text-sm text-gray-500">All items loaded</div>
        )}
      </div>
    </div>
  );
}