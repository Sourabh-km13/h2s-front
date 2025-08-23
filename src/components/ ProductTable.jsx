import { useState, useMemo } from "react";

// Mock product data
const productsData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  image: "https://via.placeholder.com/40",
  name: `Product ${i + 1}`,
  category: i % 2 === 0 ? "Electronics" : "Clothing",
  price: Math.floor(Math.random() * 1000) + 50,
  stock: Math.floor(Math.random() * 100),
  status: i % 3 === 0 ? "Active" : "Inactive",
}));

export default function ProductTable3() {
  const [products] = useState(productsData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const itemsPerPage = 10;

  // Columns in state for reordering
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

  // Filtering + Searching
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category)
      );
    });
  }, [products, search, category]);

  // Sorting
  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  // Pagination + Lazy loading
  const paginatedProducts = sortedProducts.slice(0, page * itemsPerPage);

  // Toggle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("colIndex", index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData("colIndex");
    if (sourceIndex === null) return;
    const updated = [...columns];
    const [removed] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, removed);
    setColumns(updated);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6">
      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-60"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
        </select>
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
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 cursor-move ${
                    col.sortable ? "cursor-pointer" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                {columns.map((col) => {
                  if (col.key === "image")
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded"
                        />
                      </td>
                    );
                  if (col.key === "actions")
                    return (
                      <td key={col.key} className="px-4 py-3 space-x-2">
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                        <button className="text-green-600 hover:underline">
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    );
                  if (col.key === "status")
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            p.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    );
                  if (col.key === "price")
                    return (
                      <td key={col.key} className="px-4 py-3">
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
      </div>

      {/* Lazy load button */}
      {paginatedProducts.length < sortedProducts.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}