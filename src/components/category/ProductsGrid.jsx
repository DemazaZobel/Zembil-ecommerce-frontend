import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../../features/cart/cartSlice";
import { getReviewsByProduct } from "../../features/Review/reviewSlice"; // <-- fetch reviews
import { useNavigate } from "react-router-dom";
import placeholderImage from "../../assets/placeholder.png";

const ProductsGrid = ({ items, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [popup, setPopup] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showSizes, setShowSizes] = useState(false);

  // --- Redux state ---
  const { productReviews } = useSelector((state) => state.review || {});

  // --- Wishlist ---
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // --- Modal handlers ---
  const openModal = (product) => {
    setModalProduct(product);
    setSelectedSize(product.sizes?.[0]?.sizeId || "");
    setQuantity(1);
    setCarouselIndex(0);
    setShowSizes(false);
    document.body.style.overflow = "hidden";

    // Fetch reviews for the product when modal opens
    dispatch(getReviewsByProduct(product.id));
  };

  const closeModal = () => {
    setModalProduct(null);
    document.body.style.overflow = "auto";
  };

  const handleAddToCart = async () => {
    if (!modalProduct) return;
    if (!selectedSize) return alert("Please select a size before adding to cart.");

    const sizeObj = modalProduct.sizes.find(
      (s) => s.sizeId === Number(selectedSize)
    );

    try {
      await dispatch(
        addToCart({
          productId: modalProduct.id,
          quantity,
          sizeId: sizeObj.sizeId,
        })
      ).unwrap();

      dispatch(fetchCart());

      setPopup(`${modalProduct.name} (${sizeObj.name}) added to cart 🛒`);
      closeModal();
      setTimeout(() => setPopup(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const prevImage = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? modalProduct.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCarouselIndex((prev) =>
      prev === modalProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  // --- Calculate average rating ---
  const getAverageRating = (productId) => {
    const reviews = productReviews?.[productId] || [];
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      {popup && (
        <div className="fixed top-5 right-5 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {popup}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const avgRating = getAverageRating(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative cursor-pointer"
            >
              <div onClick={() => handleCardClick(item.id)}>
                <img
                  src={
                    item.images && item.images.length > 0
                      ? `http://localhost:5000/${item.images[0]}`
                      : placeholderImage
                  }
                  alt={item.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300 z-10"
              >
                <FaHeart
                  className={wishlist.includes(item.id) ? "text-red-500" : "text-gray-400"}
                />
              </button>

              <div className="p-4" onClick={() => handleCardClick(item.id)}>
                <h3 className="font-semibold text-gray-800 truncate mb-1">{item.name}</h3>
                {item.category?.type && (
                  <p className="text-sm text-gray-500 mb-1">{item.category.type}</p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                )}

                {/* Display average rating */}
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) =>
                    i < Math.round(avgRating) ? (
                      <FaStar key={i} className="text-yellow-400 mr-1 text-xs" />
                    ) : (
                      <FaRegStar key={i} className="text-gray-300 mr-1 text-xs" />
                    )
                  )}
                  {avgRating > 0 && (
                    <span className="text-xs text-gray-600 ml-1">({avgRating.toFixed(1)})</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
                  <span className="text-primary font-bold text-base">${item.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                    className="bg-primary text-white px-3 py-1 rounded-full text-xs hover:bg-secondary transition-colors w-full sm:w-auto"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative overflow-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <div className="relative w-full h-64 mb-4 flex items-center justify-center">
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
              >
                <FaChevronLeft />
              </button>

              <img
                src={
                  modalProduct.images && modalProduct.images.length > 0
                    ? `http://localhost:5000/${modalProduct.images[carouselIndex]}`
                    : placeholderImage
                }
                alt={modalProduct.name}
                className="w-64 h-64 object-cover rounded-lg"
              />

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
              >
                <FaChevronRight />
              </button>
            </div>

            <h3 className="text-lg font-bold text-center mb-2">{modalProduct.name}</h3>
            {modalProduct.category?.type && (
              <p className="text-sm text-gray-500 text-center mb-1">{modalProduct.category.type}</p>
            )}
            {modalProduct.description && (
              <p className="text-xs text-gray-600 text-center mb-2">{modalProduct.description}</p>
            )}

            {/* Modal average rating */}
            <div className="flex justify-center mb-4">
              {(() => {
                const avgRating = getAverageRating(modalProduct.id);
                return (
                  <>
                    {[...Array(5)].map((_, i) =>
                      i < Math.round(avgRating) ? (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300 mr-1" />
                      )
                    )}
                    {avgRating > 0 && (
                      <span className="text-xs text-gray-600 ml-1">({avgRating.toFixed(1)})</span>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="mb-4 relative">
              <label className="block mb-1 text-sm font-medium">Size:</label>
              <button
                onClick={() => setShowSizes(!showSizes)}
                className="w-full border rounded px-3 py-2 text-left"
              >
                {modalProduct.sizes.find((s) => s.sizeId === Number(selectedSize))?.name ||
                  "Select size"}
              </button>
              {showSizes && (
                <ul className="absolute z-50 w-full bg-white border rounded mt-1 max-h-40 overflow-auto shadow-lg">
                  {modalProduct.sizes.map((size) => (
                    <li
                      key={size.sizeId}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedSize(size.sizeId);
                        setShowSizes(false);
                      }}
                    >
                      {size.name} ({size.stock})
                    </li>
                  ))}
                </ul>
              )}
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

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
              <span className="text-primary font-bold text-base">${modalProduct.price}</span>
              <button
                onClick={handleAddToCart}
                disabled={quantity <= 0}
                className={`bg-primary text-white px-3 py-2 rounded-lg text-sm w-full sm:w-auto transition-colors
                  ${quantity <= 0
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                    : "hover:bg-secondary"
                  }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsGrid;
