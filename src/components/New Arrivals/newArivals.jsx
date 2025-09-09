import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import { addToCart } from "../../features/cart/cartSlice";

const newArrivals = [
  { id: 1, name: "Trendy Hoodie", price: 45, rating: 4, image: "https://via.placeholder.com/300x300?text=Hoodie", description: "Cozy cotton hoodie.", sizes: ["S","M","L","XL"] },
  { id: 2, name: "Casual Sneakers", price: 60, rating: 5, image: "https://via.placeholder.com/300x300?text=Sneakers", description: "Comfortable sneakers.", sizes: ["M","L","XL"] },
  { id: 3, name: "Denim Jacket", price: 75, rating: 4, image: "https://via.placeholder.com/300x300?text=Jacket", description: "Stylish denim jacket.", sizes: ["S","M","L"] },
  { id: 4, name: "Floral Dress", price: 50, rating: 5, image: "https://via.placeholder.com/300x300?text=Dress", description: "Beautiful floral dress.", sizes: ["S","M","L"] },
  { id: 5, name: "Classic Jeans", price: 40, rating: 4, image: "https://via.placeholder.com/300x300?text=Jeans", description: "Classic fit jeans.", sizes: ["S","M","L","XL"] },
  { id: 6, name: "Leather Handbag", price: 90, rating: 5, image: "https://via.placeholder.com/300x300?text=Handbag", description: "Elegant leather handbag.", sizes: ["M","L"] },
];

const NewArrivals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Navigate to product detail
  const goToProductDetail = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Open Add-to-Cart Modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    dispatch(addToCart({ ...selectedProduct, size: selectedSize, quantity }));
    closeModal();
  };

  return (
    <section className="px-6 py-8 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#3674B5]">New Arrivals</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center min-w-[350px]">
        {newArrivals.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => goToProductDetail(item)}
          >
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
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
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering product detail navigation
                    openModal(item);
                  }}
                  className="w-full md:w-auto mt-1 md:mt-0 bg-[#3674B5] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-32 h-32 mx-auto rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold text-center mb-2">{selectedProduct.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-4">{selectedProduct.description}</p>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {selectedProduct.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
