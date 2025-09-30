import React, { useRef, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../features/product/productSlice";

const SalesSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from Redux
  const { products } = useSelector((state) => state.products || { products: [] });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products on sale
  const saleItems = products.filter((p) => p.onSale);

  // Scroll helpers
  const scrollAmount = () =>
    scrollRef.current ? Math.floor(scrollRef.current.clientWidth * 0.7) : 300;
  const scroll = (direction) =>
    scrollRef.current?.scrollBy({
      left: direction === "right" ? scrollAmount() : -scrollAmount(),
      behavior: "smooth",
    });

  const goToProductDetail = (product) =>
    navigate(`/product/${product.id}`, { state: { product } });

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0]?.sizeName || ""); // handle empty sizes
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
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
            if (scrollLeft >= scrollWidth - clientWidth - 10)
              scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3674B5]">
          Hot Sales
        </h2>
        <div className="hidden lg:flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 sm:p-3 bg-[#3674B5] text-white rounded-full hover:bg-blue-700 transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 sm:p-3 bg-[#3674B5] text-white rounded-full hover:bg-blue-700 transition"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {saleItems.length === 0 ? (
        <p className="text-center text-gray-500">No sale items at the moment.</p>
      ) : (
        <div
          ref={scrollRef}
          className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-nowrap lg:space-x-4 overflow-x-auto lg:overflow-x-scroll scrollbar-hide py-2 md:py-4"
        >
          {saleItems.map((item) => {
            const price = parseFloat(item.price);
            const originalPrice = item.saleValue
              ? Math.round(price / (1 - parseFloat(item.saleValue) / 100))
              : null;

            return (
              <div
                key={item.id}
                className="flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                onClick={() => goToProductDetail(item)}
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={`http://localhost:5000/${item.images?.[0]}`}
                    alt={item.name}
                    className="w-full h-40 sm:h-48 md:h-52 lg:h-80 lg:w-80 p-4 transition-transform duration-300 group-hover:scale-105 object-cover"
                  />
                  {item.saleValue && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {item.saleValue}% OFF
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">
                    {item.name}
                  </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        {item.description.length > 30
                          ? item.description.slice(0, 30) + "..."
                          : item.description}
                      </p>


                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[#3674B5] font-bold text-base sm:text-lg">
                        ${price.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item);
                      }}
                      className="bg-[#3674B5] text-white px-3 py-1 rounded-full hover:bg-blue-700 transition text-xs sm:text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
              src={selectedProduct.images?.[0]}
              alt={selectedProduct.name}
              className="w-32 h-32 mx-auto rounded-lg mb-4 object-cover"
            />
            <h3 className="text-lg font-bold text-center mb-2">{selectedProduct.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-4 line-clamp-3">
              {selectedProduct.description}
            </p>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {selectedProduct.sizes?.map((size) => (
                  <option key={size?.sizeName || size} value={size?.sizeName || size}>
                    {size?.sizeName || size}
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

export default SalesSection;
