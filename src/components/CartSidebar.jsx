import React, { useMemo } from "react";

function CartItemRow({ item, onInc, onDec, onRemove }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b">
      <img src={item.product.img} alt="" className="w-16 h-12 object-cover rounded" />
      <div className="flex-1">
        <div className="font-medium">{item.product.name}</div>
        <div className="text-sm text-gray-500">₹{item.product.price.toFixed(2)}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDec} className="px-2 py-1 border rounded">-</button>
        <div className="w-8 text-center">{item.qty}</div>
        <button onClick={onInc} className="px-2 py-1 border rounded">+</button>
      </div>
      <div className="w-24 text-right font-semibold">₹{(item.product.price * item.qty).toFixed(2)}</div>
      <button onClick={onRemove} className="ml-3 text-sm text-red-600">Remove</button>
    </div>
  );
}

export default function CartSidebar({ isOpen, onClose, cartItems, updateQty, removeItem, clearCart, total }) {
  const items = useMemo(() => Object.values(cartItems), [cartItems]);

  return (
    <div className={`fixed inset-0 z-40 pointer-events-none ${isOpen ? "" : "opacity-0"} transition-opacity`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/30 ${isOpen ? "pointer-events-auto" : ""}`}></div>

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform pointer-events-auto`}>
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <div className="flex items-center gap-2">
            <button onClick={clearCart} className="text-sm text-gray-500">Clear</button>
            <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded">Close</button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Cart is empty</div>
          ) : (
            items.map(it => (
              <CartItemRow
                key={it.product.id}
                item={it}
                onInc={() => updateQty(it.product.id, it.qty + 1)}
                onDec={() => updateQty(it.product.id, it.qty - 1)}
                onRemove={() => removeItem(it.product.id)}
              />
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-bold">₹{total.toFixed(2)}</div>
          </div>
          <div className="flex gap-2">
            <button disabled={items.length===0} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">Checkout</button>
            <button onClick={onClose} className="px-4 py-2 border rounded">Continue</button>
          </div>
        </div>
      </aside>
    </div>
  );
}