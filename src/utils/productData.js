export const SAMPLE_PRODUCTS = Array.from({ length: 1000 }, (_, i) => {
  const id = `p${i + 1}`;
  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Toys",
  ];
  const category = categories[i % categories.length];

  const names = {
    Electronics: ["Smartphone", "Laptop", "Headphones", "Camera", "Smartwatch"],
    Clothing: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Sneakers"],
    Books: ["Novel", "Biography", "Cookbook", "Comic", "Textbook"],
    Home: ["Chair", "Table", "Lamp", "Couch", "Bed"],
    Sports: [
      "Football",
      "Basketball",
      "Tennis Racket",
      "Yoga Mat",
      "Dumbbells",
    ],
    Toys: ["Action Figure", "Puzzle", "Doll", "Board Game", "Toy Car"],
  };

  const productName = names[category][i % names[category].length];
  const prefix = ["Premium", "Ultra", "Eco", "Classic", "Pro", "Smart"];
  const name = `${prefix[i % prefix.length]} ${productName}`;

  return {
    id,
    name,
    category,
    price: Math.floor(Math.random() * 900) + 100, // price between 100–1000
    stock: Math.floor(Math.random() * 100) + 1, // stock between 1–100
    status: i % 2 === 0 ? "Active" : "Inactive",
    desc: `${name} with high quality and great features`,
    img: `https://picsum.photos/seed/${id}/200/140`,
  };
});
