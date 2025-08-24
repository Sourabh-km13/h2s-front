import React, { useMemo } from "react";

function CartItemRow({ item, onInc, onDec, onRemove }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-3 hover:shadow-lg transition">
  <div className="flex items-center gap-4">
    {/* Thumbnail */}
    <img
      src={item.product.img}
      alt={item.product.name}
      className="w-20 h-16 object-cover rounded-lg border border-gray-200"
    />

    {/* Product Details */}
    <div className="flex-1">
      <div className="font-semibold text-gray-800 text-base">
        {item.product.name}
      </div>
      <div className="text-sm text-gray-500">
        ₹{item.product.price.toFixed(2)}
      </div>
    </div>

    {/* Remove Button */}
    <button
      onClick={onRemove}
      className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
    >
      ❌
    </button>
  </div>

  {/* Qty Controls + Price */}
  <div className="flex justify-between items-center mt-4">
    {/* Quantity Controls */}
    <div className="flex items-center gap-2">
      <button
        onClick={onDec}
        className="px-3 py-1 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 font-bold transition"
      >
        -
      </button>
      <div className="w-10 text-center font-medium">{item.qty}</div>
      <button
        onClick={onInc}
        className="px-3 py-1 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 font-bold transition"
      >
        +
      </button>
    </div>

    {/* Total Price */}
    <div className="text-lg font-semibold text-gray-700">
      ₹{(item.product.price * item.qty).toFixed(2)}
    </div>
  </div>
</div>

  );
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  updateQty,
  removeItem,
  clearCart,
  total,
}) {
  const items = useMemo(() => Object.values(cartItems), [cartItems]);

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-106 bg-white shadow-2xl transform transition-transform duration-300  ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">🛒 Your Cart</h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-600 transition"
              >
                Clear Cart
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100 transition"
            >
              X
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="p-4   overflow-y-auto h-[calc(100%-160px)] overflow-x-hidden">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              Your cart is empty 🛍️
            </div>
          ) : (
            items.map((it) => (
              <CartItemRow
                key={it.product.id}
                item={it}
                onInc={() => updateQty(it.product.id, it.qty + 1)}
                onDec={() => it.qty > 1 && updateQty(it.product.id, it.qty - 1)}
                onRemove={() => removeItem(it.product.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2 pb-4 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-bold text-gray-800">
              ₹{total.toFixed(2)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              disabled={items.length === 0}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
