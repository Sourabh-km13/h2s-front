import React, { useState, useMemo } from "react";

/**
 * Props:
 *  - products: array
 *  - addToCart(product)
 *  - onView(product)
 *  - onEdit(product)
 *  - onDeleteRequest(product)
 */
export default function ProductTable({ products, addToCart, onView, onEdit, onDeleteRequest }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // columns state (draggable)
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

  // Filtering & search
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
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

  // Pagination & lazy load (page increments)
  const paginatedProducts = sortedProducts.slice(0, page * itemsPerPage);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Drag & drop handlers
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

  // helper categories list
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.category)))], [products]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name..." className="border px-3 py-2 rounded w-64" />
        <select className="border px-3 py-2 rounded" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
          <div className="px-2 py-1 bg-gray-100 rounded">Showing {Math.min(paginatedProducts.length, sortedProducts.length)} of {sortedProducts.length}</div>
          <div className="px-2 py-1 bg-gray-100 rounded">Page {Math.min(page, totalPages || 1)} / {totalPages || 1}</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  className={`px-4 py-3 ${col.sortable ? "cursor-pointer" : "cursor-move"} select-none`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="text-xs">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
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
                      <td key={col.key} className="px-4 py-3">
                        <img src={p.img} alt={p.name} className="w-14 h-10 object-cover rounded" />
                      </td>
                    );
                  }
                  if (col.key === "actions") {
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <button onClick={() => onView(p)} className="text-blue-600 hover:underline text-sm">View</button>
                          <button onClick={() => onEdit(p)} className="text-green-600 hover:underline text-sm">Edit</button>
                          <button onClick={() => onDeleteRequest(p)} className="text-red-600 hover:underline text-sm">Delete</button>
                          <button onClick={() => addToCart(p)} className="ml-2 bg-indigo-600 text-white px-2 py-1 rounded text-sm">Add to cart</button>
                        </div>
                      </td>
                    );
                  }
                  if (col.key === "status") {
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                      </td>
                    );
                  }
                  if (col.key === "price") {
                    return <td key={col.key} className="px-4 py-3">₹{p.price}</td>;
                  }
                  return <td key={col.key} className="px-4 py-3">{p[col.key]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination / Lazy load */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page === totalPages || totalPages === 0} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>

        {paginatedProducts.length < sortedProducts.length ? (
          <div className="flex gap-2">
            <div className="text-sm text-gray-600">Showing {paginatedProducts.length} of {sortedProducts.length}</div>
            <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Load More</button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">All items loaded</div>
        )}
      </div>
    </div>
  );
}