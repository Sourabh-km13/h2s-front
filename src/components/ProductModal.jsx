import React, { useState } from "react";

/**
 * Props:
 *  - type: "view" | "edit" | "delete"
 *  - product
 *  - onClose()
 *  - onSave(updatedProduct)   // for edit
 *  - onConfirmDelete(id)     // for delete
 */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-lg p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {type === "view" && "View Product"}
            {type === "edit" && "Edit Product"}
            {type === "delete" && "Confirm Delete"}
          </h3>
          <button onClick={onClose} className="text-gray-600">
            ✕
          </button>
        </div>

        {type === "view" && (
          <div className="space-y-3">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Status:</strong> {product.status}
            </p>
            <p className="text-sm text-gray-600">{product.desc}</p>
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="px-4 py-2 border rounded">
                Close
              </button>
            </div>
          </div>
        )}

        {type === "edit" && (
          <div className="space-y-3">
            <label className="block text-sm">Name</label>
            <input
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />

            <label className="block text-sm">Category</label>
            <input
              className="w-full border p-2 rounded"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm">Price</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={form.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm">Stock</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={form.stock}
                  onChange={(e) => updateField("stock", Number(e.target.value))}
                />
              </div>
            </div>

            <label className="block text-sm">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <label className="block text-sm">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.desc}
              onChange={(e) => updateField("desc", e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(form);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {type === "delete" && (
          <div className="space-y-4">
            <p>
              Are you sure you want to delete <strong>{product.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={() => onConfirmDelete(product.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
