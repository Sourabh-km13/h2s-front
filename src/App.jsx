import React, { useState, useMemo, useCallback } from "react";
import Header from "./components/Header";
import CartSidebar from "./components/CartSidebar";
import Toast from "./components/Toast";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";

/* SAMPLE PRODUCTS */
const SAMPLE_PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Product ${i + 1}`,
  category: i % 2 === 0 ? "Electronics" : "Clothing",
  price: Math.floor(Math.random() * 900) + 50,
  stock: Math.floor(Math.random() * 120),
  status: i % 3 === 0 ? "Active" : "Inactive",
  desc: `Description for product ${i + 1}`,
  img: `https://picsum.photos/seed/p${i + 1}/200/140`,
}));

export default function App() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);

  // cartMap: { [productId]: { product, qty } }
  const [cartMap, setCartMap] = useState({});
  const [isCartOpen, setCartOpen] = useState(false);

  // modal: view | edit | delete
  const [modalType, setModalType] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);

  // toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

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

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  // Cart functions
  const addToCart = useCallback(
    (product, qty = 1) => {
      setCartMap((prev) => {
        const existing = prev[product.id];
        const nextQty = existing ? existing.qty + qty : qty;
        return { ...prev, [product.id]: { product, qty: nextQty } };
      });
      showToast("  Added to cart", "success");
      setCartOpen(true);
    },
    [showToast]
  );

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

  const removeFromCart = useCallback(
    (productId) => {
      setCartMap((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      showToast("🗑️ Removed from cart", "info");
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCartMap({});
    showToast("🧹 Cart cleared", "info");
  }, [showToast]);

  // Product actions (open modals)
  const handleView = (product) => {
    setModalProduct(product);
    setModalType("view");
  };
  const handleEdit = (product) => {
    setModalProduct(product);
    setModalType("edit");
  };
  const handleDeleteRequest = (product) => {
    setModalProduct(product);
    setModalType("delete");
  };

  const saveProduct = (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setModalProduct(null);
    setModalType(null);
    showToast("✏️ Product updated", "success");
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setModalProduct(null);
    setModalType(null);
    showToast("🗑️ Product deleted", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">
          Product Management Dashboard
        </h1>

        <ProductTable
          products={products}
          addToCart={addToCart}
          onView={handleView}
          onEdit={handleEdit}
          onDeleteRequest={handleDeleteRequest}
        />
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

      {modalProduct && modalType && (
        <ProductModal
          type={modalType}
          product={modalProduct}
          onClose={() => {
            setModalProduct(null);
            setModalType(null);
          }}
          onSave={saveProduct}
          onConfirmDelete={confirmDelete}
        />
      )}

      <Toast
        message={toast.message}
        show={toast.show}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
