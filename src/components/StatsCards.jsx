export default function StatsCards({ products, cartMap }) {
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = totalProducts - inStockCount;
  const totalCartItems = Object.values(cartMap).reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total Categories</p>
          <p className="text-xl font-bold">
            {[...Array.from(new Set(products.map((p) => p.category)))].length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">In Stock</p>
          <p className="text-xl font-bold">{inStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-xl font-bold">{outOfStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Items in Cart</p>
          <p className="text-xl font-bold">{totalCartItems}</p>
        </div>
      </div>
    </div>
  );
}
