import React, { useMemo, useState, useCallback } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import Toast from "./components/Toast";

const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    name: "Wireless Headphones",
    price: 79.99,
    desc: "Comfortable over-ear headphones",
    img: "https://picsum.photos/seed/h1/400/300",
  },
  {
    id: "p2",
    name: "Smart Watch",
    price: 129.99,
    desc: "Track your fitness and notifications",
    img: "https://picsum.photos/seed/w1/400/300",
  },
  {
    id: "p3",
    name: "Bluetooth Speaker",
    price: 49.99,
    desc: "Portable speaker with deep bass",
    img: "https://picsum.photos/seed/s1/400/300",
  },
  {
    id: "p4",
    name: "Mechanical Keyboard",
    price: 99.99,
    desc: "Tactile keys with RGB backlight",
    img: "https://picsum.photos/seed/k1/400/300",
  },
];

export default function App() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [cartMap, setCartMap] = useState({});
  const [isCartOpen, setCartOpen] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cartMap).reduce((s, it) => s + it.qty, 0),
    [cartMap]
  );
  const cartTotal = useMemo(
    () =>
      Object.values(cartMap).reduce(
        (s, it) => s + it.qty * it.product.price,
        0
      ),
    [cartMap]
  );

  const addToCart = useCallback((product, qty = 1) => {
    setCartMap((prev) => {
      const existing = prev[product.id];
      const nextQty = existing ? existing.qty + qty : qty;
      return { ...prev, [product.id]: { product, qty: nextQty } };
    });
    showToast("Added to Cart")
    // setCartOpen(true);
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setCartMap((prev) => {
      if (!prev[productId]) return prev;
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: { ...prev[productId], qty } };
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartMap((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }, []);

  const clearCart = useCallback(() => setCartMap({}), []);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">
          Product Management Dashboard
        </h1>
        <ProductList products={products} onAdd={addToCart} />
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartMap}
        updateQty={updateQty}
        removeItem={removeFromCart}
        clearCart={clearCart}
        total={cartTotal}
      />

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
