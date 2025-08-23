import React from "react";

export default function Header({ cartCount, onOpenCart }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded">
            PM
          </div>
          <div>
            <div className="text-lg font-bold">Product Dashboard</div>
            <div className="text-sm text-gray-500">
              Manage products & orders
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-2 bg-gray-50 rounded hover:bg-gray-100">
            Products
          </button>
          <button className="px-3 py-2 bg-gray-50 rounded hover:bg-gray-100">
            Orders
          </button>

          <button
            onClick={onOpenCart}
            className="relative px-3 py-2 bg-indigo-600 text-white rounded hover:opacity-95"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
