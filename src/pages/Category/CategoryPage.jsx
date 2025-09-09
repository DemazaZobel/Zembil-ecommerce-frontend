import React, { useState } from "react";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

// 🔹 Mocked product data
const MOCK_PRODUCTS = [
  { id: 1, name: "Premium T-Shirt", price: 20, discount: "10% OFF", description: "Comfortable cotton t-shirt.", rating: 4, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=T-Shirt", sizes: ["S","M","L","XL"] },
  { id: 2, name: "Designer Jeans", price: 40, discount: "15% OFF", description: "Slim fit jeans.", rating: 5, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Jeans", sizes: ["S","M","L","XL"] },
  { id: 3, name: "Winter Jacket", price: 60, discount: "20% OFF", description: "Warm jacket.", rating: 3, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Jacket", sizes: ["M","L","XL"] },
  { id: 4, name: "Dress", price: 80, discount: "25% OFF", description: "Comfortable dress.", rating: 4, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Dress", sizes: ["S","M","L"] },
  { id: 5, name: "Casual T-Shirt", price: 22, discount: "12% OFF", description: "Comfortable cotton t-shirt.", rating: 4, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Casual+T-Shirt", sizes: ["S","M","L","XL"] },
  { id: 6, name: "Classic Jeans", price: 45, discount: "18% OFF", description: "Slim fit jeans.", rating: 5, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Classic+Jeans", sizes: ["S","M","L","XL"] },
  { id: 7, name: "Autumn Jacket", price: 65, discount: "22% OFF", description: "Warm jacket.", rating: 3, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Autumn+Jacket", sizes: ["M","L","XL"] },
  { id: 8, name: "Sport Sneakers", price: 85, discount: "30% OFF", description: "Comfortable sneakers.", rating: 4, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Sneakers", sizes: ["M","L","XL"] },
];

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [popup, setPopup] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 🔹 Filter products by search
  let filtered = MOCK_PRODUCTS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Sorting logic
  if (sort === "priceLowHigh") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "priceHighLow") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  // 🔹 Modal functions
  const openModal = (product) => {
    setModalProduct(product);
    setSelectedSize(product.sizes?.[0] || ""); // safe
    setQuantity(1);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalProduct(null);
    document.body.style.overflow = "auto";
  };
  const handleAddToCart = () => {
    if (!modalProduct) return;
    dispatch(addToCart({ ...modalProduct, size: selectedSize, quantity }));
    setPopup(`${modalProduct.name} added to cart 🛒`);
    closeModal();
    setTimeout(() => setPopup(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Popup */}
      {popup && (
        <div className="fixed top-5 right-5 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {popup}
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-primary">
        All Products
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
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 sm:h-52 md:h-60 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">{product.name}</h3>

                <div className="flex items-center mb-2 mt-1">
                  {[...Array(5)].map((_, i) =>
                    i < product.rating ? (
                      <FaStar key={i} className="text-yellow-400 mr-1 text-xs sm:text-sm" />
                    ) : (
                      <FaRegStar key={i} className="text-gray-300 mr-1 text-xs sm:text-sm" />
                    )
                  )}
                  <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-base sm:text-lg">${product.price}</span>
                  <button
                    onClick={() => openModal(product)}
                    className="bg-primary text-white px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-secondary transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p className="text-lg">No products found 😢</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><FaTimes /></button>
            <img src={modalProduct.image} alt={modalProduct.name} className="w-32 h-32 mx-auto rounded-lg mb-4" />
            <h3 className="text-lg font-bold text-center mb-2">{modalProduct.name}</h3>

            {modalProduct.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Size:</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full border rounded px-3 py-2">
                  {modalProduct.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Quantity:</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
            </div>

            <button onClick={handleAddToCart} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
