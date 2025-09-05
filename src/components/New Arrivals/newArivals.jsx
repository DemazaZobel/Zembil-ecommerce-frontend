import React from "react";

// sample data (replace with real products or import from products.js)
const newArrivals = [
  { id: 1, name: "Trendy Hoodie", price: 45, rating: 4, image: "https://via.placeholder.com/300x300?text=Hoodie" },
  { id: 2, name: "Casual Sneakers", price: 60, rating: 5, image: "https://via.placeholder.com/300x300?text=Sneakers" },
  { id: 3, name: "Denim Jacket", price: 75, rating: 4, image: "https://via.placeholder.com/300x300?text=Jacket" },
  { id: 4, name: "Floral Dress", price: 50, rating: 5, image: "https://via.placeholder.com/300x300?text=Dress" },
  { id: 5, name: "Classic Jeans", price: 40, rating: 4, image: "https://via.placeholder.com/300x300?text=Jeans" },
  { id: 6, name: "Leather Handbag", price: 90, rating: 5, image: "https://via.placeholder.com/300x300?text=Handbag" },
];

const NewArrivals = () => {
  return (
    <section className="px-6 py-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-center">✨ New Arrivals</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {newArrivals.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
              <p className="text-yellow-500 text-sm">⭐ {item.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
