import React from "react";
import { NavLink } from "react-router-dom";

export default function Header({ cartCount, onOpenCart, callFrom }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <NavLink to="/">
            <div className="w-15 h-10 bg-indigo-600 text-white flex items-center justify-center rounded">
              H ⮕ S{" "}
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold">Product Dashboard</div>
              <div className="text-sm text-gray-500">
                Manage products & orders
              </div>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "bg-gray-50 hover:bg-gray-100"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "bg-gray-50 hover:bg-gray-100"
              }`
            }
          >
            Orders
          </NavLink>

          {/* Cart */}
          {callFrom !== "ORDER_PAGE" && (
            <button
              onClick={onOpenCart}
              className="relative px-3 py-2 bg-indigo-600 text-white rounded hover:opacity-95"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
