import React, { useState, useMemo, useCallback } from "react";
import Header from "../components/Header";
import CartSidebar from "../components/CartSidebar";
import Toast from "../components/Toast";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import StatsCards from "../components/StatsCards";
import useCart from "../hooks/useCart";

import { SAMPLE_PRODUCTS } from "../utils/productData";

function HomePage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);

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

  const {
    cartMap,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

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

      <StatsCards />

      <main className="max-w-7xl mx-auto p-6">
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

export default HomePage;
