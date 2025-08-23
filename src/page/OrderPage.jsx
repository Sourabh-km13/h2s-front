import React from "react";
import Header from "../components/Header";

const orders = [
  {
    id: "ORD-1001",
    date: "2025-08-20",
    products: [
      { id: "P1", name: "iPhone 15 Pro", price: 1200, qty: 1 },
      { id: "P2", name: "AirPods Pro", price: 250, qty: 2 },
      { id: "P3", name: "Apple Watch", price: 500, qty: 1 },
    ],
  },
  {
    id: "ORD-1002",
    date: "2025-08-21",
    products: [
      { id: "P4", name: "Samsung Galaxy S24", price: 999, qty: 1 },
      { id: "P5", name: "Galaxy Buds 2", price: 150, qty: 1 },
    ],
  },
];

const OrderPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6  bg-gray-50">
      <Header  callFrom={"ORDER_PAGE"} />

      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow rounded-xl p-5 space-y-4"
        >
          {/* Order Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Order #{order.id}
            </h2>
            <span className="text-sm text-gray-500">{order.date}</span>
          </div>

          {/* Products */}
          <div className="grid gap-4 md:grid-cols-2">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border rounded-lg p-3 bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {product.qty}</p>
                </div>
                <p className="font-semibold text-gray-700">
                  ${product.price * product.qty}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-3 border-t flex justify-end">
            <p className="font-bold text-gray-800">
              Total: $
              {order.products.reduce((sum, p) => sum + p.price * p.qty, 0)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
