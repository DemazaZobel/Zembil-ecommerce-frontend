import React, { useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

const ProductsGrid = ({ items, title }) => {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [popup, setPopup] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const openModal = (product) => {
    setModalProduct(product);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalProduct(null);
    document.body.style.overflow = "auto";
  };

  const handleAddToCart = () => {
    if (!modalProduct || !selectedSize) return;
    dispatch(addToCart({ ...modalProduct, size: selectedSize, quantity }));
    setPopup(`${modalProduct.name} added to cart 🛒`);
    closeModal();
    setTimeout(() => setPopup(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      {popup && (
        <div className="fixed top-5 right-5 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {popup}
        </div>
      )}

      <h2 className="text-3xl font-bold text-primary text-center mb-8">{title} Collection</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
            <img src={item.image} alt={item.name} className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105" />
            <button
              type="button"
              onClick={() => toggleWishlist(item.id)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300"
            >
              <FaHeart className={wishlist.includes(item.id) ? "text-red-500" : "text-gray-400"} />
            </button>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate mb-1">{item.name}</h3>
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
                <span className="text-primary font-bold text-base">${item.price}</span>
                <button
                  onClick={() => openModal(item)}
                  className="bg-primary text-white px-3 py-1 rounded-full text-xs hover:bg-secondary transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><FaTimes /></button>
            <img src={modalProduct.image} alt={modalProduct.name} className="w-32 h-32 mx-auto rounded-lg mb-4" />
            <h3 className="text-lg font-bold text-center mb-2">{modalProduct.name}</h3>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Size:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full border rounded px-3 py-2">
                {modalProduct.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>

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
    </section>
  );
};

export default ProductsGrid;
