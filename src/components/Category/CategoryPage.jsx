import React from "react";
import { products } from "../common/products.js"; // store all products in one place

export default function CategoryPage({ category }) {
  // Filter products based on category
  const filteredProducts = products.filter(
    (item) => item.category === category
  );

  // Custom slogans
  const slogans = {
    men: "Style that defines confidence.",
    women: "Elegance redefined for you.",
    kids: "Fun, colorful, and comfy fashion."
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold capitalize">{category}</h2>
        <p className="text-gray-600 mt-2">{slogans[category]}</p>
      </div>

      {/* Layout: 1 big image + 4 smaller ones */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Big image */}
        <div
          className={`col-span-2 ${
            category === "men" ? "order-last md:col-start-4 md:col-span-2" : ""
          } ${category === "kids" ? "order-first md:col-span-2" : ""}`}
        >
          <img
            src={filteredProducts[0]?.image}
            alt={filteredProducts[0]?.name}
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* 4 smaller images */}
        <div className="grid grid-cols-2 gap-4 col-span-3">
          {filteredProducts.slice(1, 5).map((item) => (
            <div
              key={item.id}
              className="cursor-pointer group relative overflow-hidden rounded-lg shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <p className="text-white font-medium">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
