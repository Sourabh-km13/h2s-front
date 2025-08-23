import React, { useState } from "react";

export default function ProductModal({
  type,
  product,
  onClose,
  onSave,
  onConfirmDelete,
}) {
  const [form, setForm] = useState({ ...product });

  const updateField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Card */}
      <div
        className="bg-white rounded-xl w-full max-w-lg mx-3 p-5 shadow-xl transform transition-all duration-300 scale-95 animate-fadeIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {type === "view" && "👀 View Product"}
            {type === "edit" && "✏️ Edit Product"}
            {type === "delete" && "⚠️ Confirm Delete"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        {/* VIEW */}
        {type === "view" && (
          <div className="space-y-3">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-44 object-cover rounded-lg shadow"
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-semibold">Name:</span> {product.name}</p>
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Price:</span> ₹{product.price}</p>
              <p><span className="font-semibold">Stock:</span> {product.stock}</p>
              <p className="col-span-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status}
                </span>
              </p>
            </div>
            <p className="text-gray-600 text-sm">{product.desc}</p>

            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* EDIT */}
        {type === "edit" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />

            <label className="block text-sm font-medium">Category</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  value={form.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  value={form.stock}
                  onChange={(e) => updateField("stock", Number(e.target.value))}
                />
              </div>
            </div>

            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              rows="3"
              value={form.desc}
              onChange={(e) => updateField("desc", e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(form)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* DELETE */}
        {type === "delete" && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong className="text-red-600">{product.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirmDelete(product.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}