// src/components/Category/ProductsGrid.jsx
import React, { useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";

const ProductsGrid = ({ items, title }) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const categories = ["all", ...new Set(items.map((item) => item.category))];

  const filteredItems = items
    .filter((item) => (activeFilter === "all" ? true : item.category === activeFilter))
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-[#3674B5] text-center mb-8">
        {title} Collection
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3674B5]"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === category
                ? "bg-[#3674B5] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
          >
            {/* Image + Wishlist */}
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300"
              >
                <FaHeart
                  className={`${
                    wishlist.includes(item.id) ? "text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-[#3674B5] hover:text-white transition-colors duration-300">
                  <FaShoppingCart size={14} />
                </button>
                <button className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-[#3674B5] hover:text-white transition-colors duration-300">
                  <FaEye size={14} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{item.category}</p>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">
                {item.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) =>
                  i < item.rating ? (
                    <FaStar key={i} className="text-yellow-400 mr-1 text-xs" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-300 mr-1 text-xs" />
                  )
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-[#3674B5] font-bold text-base sm:text-lg">
                  ${item.price}
                </span>
              </div>

              <button className="w-full mt-4 bg-[#3674B5] text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsGrid;
