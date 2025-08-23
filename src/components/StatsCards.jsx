const stats = [
  { label: "Total Products", value: "1,245" },
  { label: "Total Revenue", value: "$54,320" },
  { label: "Low Stock Items", value: "32" },
  { label: "Categories Count", value: "12" },
];

export default function StatsCards() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
