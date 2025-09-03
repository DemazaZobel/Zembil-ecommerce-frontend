import React, { useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";

const newArrivalItems = [
  {
    id: 1,
    name: "Stylish Shirt",
    price: 25,
    rating: 4,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Shirt",
    category: "Shirts",
    description: "A modern stylish shirt perfect for casual and office wear.",
  },
  {
    id: 2,
    name: "Classic Denim Jeans",
    price: 40,
    rating: 5,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Jeans",
    category: "Bottoms",
    description: "Durable slim-fit denim jeans designed for comfort and style.",
  },
  {
    id: 3,
    name: "Premium Leather Jacket",
    price: 70,
    rating: 4,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Jacket",
    category: "Outerwear",
    description: "A premium leather jacket that adds a bold statement.",
  },
  {
    id: 4,
    name: "Running Sneakers",
    price: 60,
    rating: 3,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Sneakers",
    category: "Footwear",
    description: "Lightweight sneakers designed for both comfort and performance.",
  },
  {
    id: 5,
    name: "Floral Summer Dress",
    price: 35,
    rating: 5,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Dress",
    category: "Dresses",
    description: "A floral dress perfect for summer outings and vacations.",
  },
  {
    id: 6,
    name: "Premium Cotton T-Shirt",
    price: 20,
    rating: 4,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=T-Shirt",
    category: "Tops",
    description: "Soft cotton T-shirt, versatile and breathable for daily wear.",
  },
  {
    id: 7,
    name: "Comfort Hoodie",
    price: 50,
    rating: 4,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Hoodie",
    category: "Outerwear",
    description: "A cozy hoodie for warmth and relaxed everyday style.",
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    price: 45,
    rating: 5,
    image: "https://via.placeholder.com/300x300/78dcca/ffffff?text=Chinos",
    category: "Bottoms",
    description: "Slim-fit chinos, a versatile piece for work or casual wear.",
  },

];

const NewArrivals = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((itemId) => itemId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const categories = ["all", ...new Set(newArrivalItems.map((item) => item.category))];

  const filteredItems =
    activeFilter === "all"
      ? newArrivalItems
      : newArrivalItems.filter((item) => item.category === activeFilter);

  return (
    <section className="max-w-6xl mx-auto px-4 m-12 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header with filter options */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3674B5] p-8 md:mb-0 text-center">
        New Arrivals
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-[#3674B5] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 sm:h-52 md:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badge */}
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                New
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300"
                aria-label="Add to wishlist"
              >
                <FaHeart
                  className={`${
                    wishlist.includes(item.id) ? "text-red-500" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Action Buttons (hover) */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-[#3674B5] hover:text-white transition-colors duration-300">
                  <FaShoppingCart size={14} />
                </button>
                <button className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-[#3674B5] hover:text-white transition-colors duration-300">
                  <FaEye size={14} />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{item.category}</p>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">
                {item.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                {item.description}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) =>
                    i < item.rating ? (
                      <FaStar key={i} className="text-yellow-400 mr-1 text-xs" />
                    ) : (
                      <FaRegStar key={i} className="text-gray-300 mr-1 text-xs" />
                    )
                  )}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({item.rating})
                </span>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#3674B5] font-bold text-base sm:text-lg">
                  ${item.price}
                </span>
              </div>

              {/* Add to Cart Button */}
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

export default NewArrivals;
