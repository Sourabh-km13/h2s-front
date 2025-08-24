import React from "react";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  priceRange,
  setPriceRange,
  stockFilter,
  setStockFilter,
  statusFilter,
  setStatusFilter,
  onClear,
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-center">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name..."
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-[2] w-full"
        />

        {/* Category */}
        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Price */}
        <input
          type="text"
          placeholder="Price Range (e.g. 100-500)"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1  w-full"
        />

        {/* Stock */}
        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1 w-full"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        {/* Status */}
        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 flex-1 w-full"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}