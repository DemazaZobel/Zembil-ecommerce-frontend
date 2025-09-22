// src/components/products/NewArrivals.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation  } from "react-router-dom";
import { FaStar, FaRegStar, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { addToCart } from "../../features/cart/cartSlice";
import { fetchProducts } from "../../features/product/productSlice";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info } = useSelector((state) => state.user);
  const location = useLocation();

  const { products, loading } = useSelector((state) => state.products);
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Sort by most recently added/updated
  useEffect(() => {
    if (products.length) {
      const sorted = [...products].sort(
        (a, b) =>
          new Date(b.createdat || b.updatedat) - new Date(a.createdat || a.updatedat)
      );
      setNewArrivals(sorted.slice(0, 6));
    }
  }, [products]);

  const goToProductDetail = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0]?.sizeId || "");
    setQuantity(1);
    setCurrentImageIndex(0); // Reset carousel
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

 const handleAddToCart = () => {
  if (!selectedProduct || !selectedSize) return;

  dispatch(
    addToCart({
      productId: selectedProduct.id,
      quantity,
      sizeId: Number(selectedSize), // make sure it's a number
    })
  );
  closeModal();
};


  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;

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
                src={`http://localhost:5000/${item.images?.[0]}`}
                alt={item.name}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">{item.name}</h3>
              {item.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">{item.description}</p>
              )}

              {/* Rating */}
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) =>
                  i < (item.rating || 0) ? (
                    <FaStar key={i} className="text-yellow-400 mr-1 text-xs sm:text-sm" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-300 mr-1 text-xs sm:text-sm" />
                  )
                )}
                <span className="text-xs text-gray-500 ml-1">({item.rating || 0})</span>
              </div>

           

              <div className="flex flex-col md:flex-row justify-between items-center">
                <span className="text-[#3674B5] font-bold text-base sm:text-lg mb-1 md:mb-0">
                  ${item.price}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (info) {
                      // User is logged in
                      openModal(item);
                    } else {
                      // User not logged in
                      toast.error("Please login first");
                      navigate("/login", { state: { from: location } });
                    }
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
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>

            {/* Carousel */}
            <div className="relative w-full h-64 sm:h-72 mb-4 flex justify-center items-center">
              {selectedProduct.images?.length > 0 && (
                <>
                  <img
                    src={`http://localhost:5000/${selectedProduct.images[currentImageIndex]}`}
                    alt={selectedProduct.name}
                    className="w-40 sm:w-48 h-40 sm:h-48 object-cover rounded-lg"
                  />
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <h3 className="text-lg font-bold text-center mb-2">{selectedProduct.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-4">{selectedProduct.description}</p>

            {/* Custom Size Selector */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Size:</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => {
                  const sizeId = size.sizeId || size;
                  const sizeName = size.name || size;
                  const isSelected = selectedSize === sizeId;
                  return (
                    <button
                      key={sizeId}
                      onClick={() => setSelectedSize(sizeId)}
                      className={`px-3 py-1 border rounded-lg text-sm font-medium ${
                        isSelected ? "bg-[#3674B5] text-white border-[#3674B5]" : "bg-white text-gray-700 border-gray-300"
                      } hover:bg-[#3674B5] hover:text-white transition`}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
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
              disabled={quantity <= 0}
              className={`w-full py-2 rounded-lg text-white transition ${
                quantity <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#3674B5] hover:bg-blue-700"
              }`}
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
