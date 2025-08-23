import React, { useState } from "react";

export default function ProductCard({ product, onAdd }) {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => {
      onAdd(product, 1);
      setAdding(false);
    }, 150);
  };

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden flex flex-col">
      <img
        src={product.img}
        alt={product.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 flex-1">{product.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-bold">${product.price.toFixed(2)}</div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:opacity-95 disabled:opacity-60"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
