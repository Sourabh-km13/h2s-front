export const SAMPLE_PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
    id: `p${i + 1}`,
    name: `Product ${i + 1}`,
    category: i % 2 === 0 ? "Electronics" : "Clothing",
    price: Math.floor(Math.random() * 900) + 50,
    stock: Math.floor(Math.random() * 120),
    status: i % 3 === 0 ? "Active" : "Inactive",
    desc: `Description for product ${i + 1}`,
    img: `https://picsum.photos/seed/p${i + 1}/200/140`,
  }));