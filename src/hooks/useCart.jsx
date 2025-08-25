import { useState, useMemo, useCallback } from "react";

export default function useCart( showToast ) {
  const [cartMap, setCartMap] = useState({});

  // Total item count
  const cartCount = useMemo(
    () => Object.values(cartMap).reduce((sum, it) => sum + it.qty, 0),
    [cartMap]
  );

  //  Total price
  const cartTotal = useMemo(
    () =>
      Object.values(cartMap).reduce(
        (sum, it) => sum + it.qty * it.product.price,
        0
      ),
    [cartMap]
  );

  //  Add product
  const addToCart = useCallback((product, qty = 1) => {
    setCartMap((prev) => {
      const existing = prev[product.id];
      const nextQty = existing ? existing.qty + qty : qty;
      return {
        ...prev,
        [product.id]: { product, qty: nextQty },
      };
    });
    showToast("Item added to Cart");
  }, []);

  //  Update quantity
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

  //  Remove item
  const removeFromCart = useCallback((productId) => {
    setCartMap((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }, []);

  //  Clear cart
  const clearCart = useCallback(() => {
    setCartMap({});
  }, []);

  return {
    cartMap,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  };
}
