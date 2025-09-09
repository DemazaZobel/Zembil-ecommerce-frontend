import React, { useRef, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import tshirt from "../../assets/tshirt.jpg";
import jeans from "../../assets/jeans.jpg";
import dress from "../../assets/dress.jpg";
import jacket from "../../assets/jacket.jpg";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const saleItems = [
  { id: 1, name: "Premium T-Shirt", price: 20, discount: "10% OFF", description: "Comfortable cotton t-shirt.", rating: 4, image: tshirt, sizes: ["S","M","L","XL"] },
  { id: 2, name: "Designer Jeans", price: 40, discount: "15% OFF", description: "Slim fit jeans.", rating: 5, image: jeans, sizes: ["S","M","L","XL"] },
  { id: 3, name: "Winter Jacket", price: 60, discount: "20% OFF", description: "Warm jacket.", rating: 3, image: jacket, sizes: ["M","L","XL"] },
  { id: 4, name: "Dress", price: 80, discount: "25% OFF", description: "Comfortable dress.", rating: 4, image: dress, sizes: ["S","M","L"] },
  { id: 5, name: "Casual T-Shirt", price: 22, discount: "12% OFF", description: "Comfortable cotton t-shirt.", rating: 4, image: tshirt, sizes: ["S","M","L","XL"] },
  { id: 6, name: "Classic Jeans", price: 45, discount: "18% OFF", description: "Slim fit jeans.", rating: 5, image: jeans, sizes: ["S","M","L","XL"] },
  { id: 7, name: "Autumn Jacket", price: 65, discount: "22% OFF", description: "Warm jacket.", rating: 3, image: jacket, sizes: ["M","L","XL"] },
  { id: 8, name: "Sport Sneakers", price: 85, discount: "30% OFF", description: "Comfortable sneakers.", rating: 4, image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Sneakers", sizes: ["M","L","XL"] },
];

const SalesSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll helpers
  const scrollAmount = () => scrollRef.current ? Math.floor(scrollRef.current.clientWidth * 0.7) : 300;
  const scroll = (direction) => scrollRef.current?.scrollBy({ left: direction === "right" ? scrollAmount() : -scrollAmount(), behavior: "smooth" });

  // Navigate to product detail
  const goToProductDetail = (product) => navigate(`/product/${product.id}`, { state: { product } });

  // Open modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scroll
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

  // Auto-scroll on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        scrollInterval.current = setInterval(() => {
          if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            if (scrollLeft >= scrollWidth - clientWidth - 10) scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
            else scroll("right");
          }
        }, 3000);
      } else clearInterval(scrollInterval.current);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(scrollInterval.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3674B5]">Hot Sales</h2>
        <div className="hidden lg:flex space-x-2">
          <button onClick={() => scroll("left")} className="p-2 sm:p-3 bg-[#3674B5] text-white rounded-full hover:bg-blue-700 transition"><FaArrowLeft /></button>
          <button onClick={() => scroll("right")} className="p-2 sm:p-3 bg-[#3674B5] text-white rounded-full hover:bg-blue-700 transition"><FaArrowRight /></button>
        </div>
      </div>

      <div ref={scrollRef} className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-nowrap lg:space-x-4 overflow-x-auto lg:overflow-x-scroll scrollbar-hide py-2 md:py-4">
        {saleItems.map((item) => (
          <div key={item.id} className="flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group" onClick={() => goToProductDetail(item)}>
            <div className="relative overflow-hidden rounded-t-xl" >
              <img src={item.image} alt={item.name} className="w-full h-40 sm:h-48 md:h-52 lg:h-80 lg:w-80 p-4 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{item.discount}</div>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">{item.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-1 line-clamp-2 h-8 md:h-10">{item.description}</p>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => i < item.rating ? <FaStar key={i} className="text-yellow-400 mr-1 text-xs sm:text-sm" /> : <FaRegStar key={i} className="text-gray-300 mr-1 text-xs sm:text-sm" />)}
                <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[#3674B5] font-bold text-base sm:text-lg">${item.price}</span>
                  <span className="text-xs text-gray-400 line-through">${Math.round(item.price / (1 - parseInt(item.discount) / 100))}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); openModal(item); }} className="bg-[#3674B5] text-white px-3 py-1 rounded-full hover:bg-blue-700 transition text-xs sm:text-sm">
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
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><FaTimes /></button>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-32 h-32 mx-auto rounded-lg mb-4" />
            <h3 className="text-lg font-bold text-center mb-2">{selectedProduct.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-4">{selectedProduct.description}</p>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Size:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full border rounded px-3 py-2">
                {selectedProduct.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Quantity:</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
            </div>

            <button onClick={handleAddToCart} className="w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesSection;
