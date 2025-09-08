import React, { useState } from "react";
import { FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { products } from "../../data/productsData.js";
import { Link } from "react-router-dom";

const CategoryPage = ({ category, onAddToCart }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // Filter by search
  let filtered = products[category].filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort logic
  if (sort === "priceLowHigh") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "priceHighLow") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 capitalize text-center text-primary">
        {category} Collection
      </h2>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-1/2 p-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 sm:h-52 md:h-60 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-2 mt-1">
                  {[...Array(5)].map((_, i) =>
                    i < product.rating ? (
                      <FaStar
                        key={i}
                        className="text-yellow-400 mr-1 text-xs sm:text-sm"
                      />
                    ) : (
                      <FaRegStar
                        key={i}
                        className="text-gray-300 mr-1 text-xs sm:text-sm"
                      />
                    )
                  )}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.rating})
                  </span>
                </div>

                {/* Price + Add to Cart */}
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-base sm:text-lg">
                    ${product.price}
                  </span>

                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stop link navigation
                      onAddToCart(product);
                    }}
                    className="hidden sm:inline-block text-xs sm:text-sm bg-primary text-white px-3 py-1 rounded-full hover:bg-secondary transition-colors"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToCart(product);
                    }}
                    className="relative sm:hidden flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full hover:w-24 transition-all duration-300 overflow-hidden"
                  >
                    <FaShoppingCart size={14} />
                    <span className="absolute left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs whitespace-nowrap">
                      Add to Cart
                    </span>
                  </button>
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
    </div>
  );
};

export default CategoryPage;



  {/* Mobile: Cart Icon with hover text 
                  <button
                    onClick={() => onAddToCart(product)}
                    className="text-xs sm:text-sm bg-primary text-white px-3 py-2 rounded-full hover:bg-secondary transition-colors w-full sm:w-auto"
                  >
                    Add to Cart
                  </button>
 */}