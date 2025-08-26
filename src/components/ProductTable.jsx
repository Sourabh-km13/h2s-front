/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import ProductFilter from "./ProductFilter";
import { usePaginationCache } from "../hooks/usePaginationWithCache";
import Pagination from "./Pagination";
import useDebounce from "../hooks/useDebounce";


export default function ProductTable({
  products,
  addToCart,
  onView,
  onEdit,
  onDeleteRequest,
}) {
  const [data , setData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setloading] = useState(false);
  const [columns, setColumns] = useState([
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "username", label: "Username", sortable: false },
    { key: "address", label: "Address", sortable: false },
    { key: "phone", label: "Phone", sortable: true },
    { key: "website", label: "Website", sortable: true },
    { key:"company", label:"Company", sortable:true},
  ]);
  useEffect(() => {
    async function fetchData (){
      const data = await fetch('https://jsonplaceholder.typicode.com/users')
      const response = await data.json();
      setData(response);
      console.log(typeof(response),response);
    }
    try {
      setloading(true);
      fetchData();
      setloading(false)
    } catch (error) {
      console.log(error)
    }
    
  }, [])
  const handleSearchChange = (v) => {
    setSearch(v);
    setPage(1);
  };

  const handleCategoryChange = (v) => {
    setCategory(v);
    setPage(1);
  };

  const handlePriceRangeChange = (v) => {
    setPriceRange(v);
    setPage(1);
  };

  const handleStockFilterChange = (v) => {
    setStockFilter(v);
    setPage(1); 
  };

  const handleStatusFilterChange = (v) => {
    setStatusFilter(v);
    setPage(1); 
  };

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const parsePriceRange = (range) => {
    const [min, max] = range.split("-").map((v) => Number(v.trim()));
    return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? Infinity : max };
  };
  const debouncedSearch = useDebounce(search, 400);

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
  }, [products, debouncedSearch, category, priceRange, stockFilter, statusFilter]);

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
  const itemsPerPage = 10;
  const {
    page,
    totalPages,
    data: paginatedProducts,
    setPage,
    next,
    prev,
  } = usePaginationCache(sortedProducts, itemsPerPage);

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

  const handleClearFilters = () => {
    console.log("handleClearFilters");
    setSearch("");
    setCategory("All");
    setPriceRange("");
    setStatusFilter("All");
    setStockFilter("All");
    setPage(1);
  };


return (
    <div>
      {/* <ProductFilter
        search={search}
        setSearch={handleSearchChange}
        category={category}
        setCategory={handleCategoryChange}
        categories={categories}
        priceRange={priceRange}
        setPriceRange={handlePriceRangeChange}
        stockFilter={stockFilter}
        setStockFilter={handleStockFilterChange}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        onClear={handleClearFilters}
      /> */}
      {/* Info */}
      {/* <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-gray-600 mb-3">
        <div className="px-2 py-1 bg-gray-100 rounded-lg">
          Showing {(page - 1) * itemsPerPage + 1} -{" "}
          {Math.min(page * itemsPerPage, sortedProducts.length)} of{" "}
          {sortedProducts.length}
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-lg">
          Page {page} / {totalPages || 1}
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        {loading? (
          <div className="text-center py-10 text-gray-500">
            loading
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
              {data.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  {columns.map((col) => {
                    
                    if(col.key==="id"){
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium `}
                          >
                            {p.id}
                          </span>
                        </td>
                      );
                    }
                    if(col.key==="company"){
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium `}
                          >
                            {p.company.name}
                          </span>
                        </td>
                      );
                    }
                    if(col.key==="username"){
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium `}
                          >
                            {p.username}
                          </span>
                        </td>
                      );
                    }
                    if(col.key==="name"){
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium `}
                          >
                            {p.name}
                          </span>
                        </td>
                      );
                    }
                    if(col.key==="website"){
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium `}
                          >
                            {p.website}
                          </span>
                        </td>
                      );
                    }
                    
                    if (col.key === "phone")
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium `}
                          >
                            {p.phone}
                          </span>
                        </td>
                      );
                    if (col.key === "address")
                      return (
                        <td key={col.key} className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium`}
                          >
                            {`${p.address.city} ${p.address.street} ${p.address.suite} ${p.address.zipcode}`}
                          </span>
                        </td>
                      );
                    if (col.key === "price")
                      return (
                        <td key={col.key} className="px-4 py-3 font-medium">
                          ₹{p.price}
                        </td>
                      );
                    
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {paginatedProducts.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          prev={prev}
          next={next}
        />
      )}
    </div>
  );
}
