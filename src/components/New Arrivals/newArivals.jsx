import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

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
    <section className="px-6 py-8 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#3674B5]">✨ New Arrivals</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center min-w-[350px]">
        {newArrivals.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* New badge */}
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">{item.name}</h3>

              {/* Rating */}
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) =>
                  i < item.rating ? (
                    <FaStar key={i} className="text-yellow-400 mr-1 text-xs sm:text-sm" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-300 mr-1 text-xs sm:text-sm" />
                  )
                )}
                <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center">
                <span className="text-[#3674B5] font-bold text-base sm:text-lg mb-1 md:mb-0">
                  ${item.price}
                </span>
                <button className="w-full md:w-auto mt-1 md:mt-0 bg-[#3674B5] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
