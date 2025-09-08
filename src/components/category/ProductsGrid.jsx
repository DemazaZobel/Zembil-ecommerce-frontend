// src/components/ProductsGrid.jsx
import React, { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductsGrid = ({ items, title, onAddToCart }) => {
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
    .filter((item) =>
      activeFilter === "all" ? true : item.category === activeFilter
    )
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">
        {title} Collection
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                {/* Image + Hover Actions */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); // prevent link navigation
                      toggleWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300"
                  >
                    <FaHeart
                      className={`${
                        wishlist.includes(item.id)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) =>
                      i < item.rating ? (
                        <FaStar
                          key={i}
                          className="text-yellow-400 mr-1 text-xs"
                        />
                      ) : (
                        <FaRegStar
                          key={i}
                          className="text-gray-300 mr-1 text-xs"
                        />
                      )
                    )}
                    <span className="text-gray-400 text-xs ml-1">
                      ({item.rating})
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-primary font-bold text-base sm:text-lg">
                      ${item.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p className="text-lg">No products found 😢</p>
            <p className="text-sm">Try searching for something else</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;
