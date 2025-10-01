import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  clearCurrentProduct,
} from "../../features/product/productSlice";
import { addToCart, fetchCart } from "../../features/cart/cartSlice";

// Components
import ReviewSection from "../../components/products/ReviewSection.jsx";
import SimilarProducts from "../../components/products/SimilarProducts.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector(
    (state) => state.products
  );

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState(null); // <-- popup state
  const LoggedUser= localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // Fetch product by ID
  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      const images = Array.isArray(product.images)
        ? product.images
        : product.images
        ? [product.images]
        : [];
      setMainImage(images[0] || "");

      // Preselect the first size with stock > 0
      const firstAvailableSize = product.sizes?.find((s) => s.stock > 0);
      setSelectedSize(firstAvailableSize?.sizeId || "");
    }
  }, [product]);

  if (loading || !product) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  const images = Array.isArray(product.images)
    ? product.images
    : product.images
    ? [product.images]
    : [];

  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setPopup("Please select a size before adding to cart.");
      setTimeout(() => setPopup(null), 2000);
      return;
    }

    if (quantity <= 0) {
      setPopup("Quantity must be at least 1");
      setTimeout(() => setPopup(null), 2000);
      return;
    }

    const sizeObj = product.sizes?.find(
      (s) => s.sizeId === Number(selectedSize)
    );

    if (sizeObj?.stock === 0) {
      setPopup("Selected size is out of stock");
      setTimeout(() => setPopup(null), 2000);
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product.id,
          sizeId: sizeObj?.sizeId,
          size: sizeObj?.name,
          quantity,
        })
      ).unwrap();

      dispatch(fetchCart());

      setPopup(`Added ${product.name} (${sizeObj?.name || "Default"}) to cart 🛒`);
      setTimeout(() => setPopup(null), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setPopup("Failed to add to cart. Please try again.");
      setTimeout(() => setPopup(null), 2000);
    }
  };

  const similarProducts =
    product.category?.products?.filter((p) => p.id !== product.id) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Notification popup */}
      {popup && (
        <div className="fixed top-5 right-5 bg-[#3674B5] text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {popup}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:p-12">
        {/* Image gallery */}
        <div>
          {mainImage && (
            <img
              src={`http://localhost:5000/${mainImage}`}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl shadow-md mb-4"
            />
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <img
                  key={img + idx}
                  src={`http://localhost:5000/${img}`}
                  alt={`${product.name}-${idx}`}
                  className={`h-20 w-full object-cover rounded-md cursor-pointer border-2 ${
                    mainImage === img ? "border-[#3674B5]" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="mt-2 text-gray-600">{product.description || "No description available."}</p>
            <p className="mt-2 text-sm text-gray-500">
              Category: {product.category?.name || "N/A"}
            </p>
            <p className="mt-2 text-xl font-bold text-[#3674B5]">${product.price || 0}</p>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <label className="block mb-1 font-semibold">Select Size:</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj) => {
                    const isSelected = selectedSize === sizeObj.sizeId;
                    const outOfStock = sizeObj.stock === 0;
                    return (
                      <button
                        key={sizeObj.sizeId}
                        onClick={() => !outOfStock && setSelectedSize(sizeObj.sizeId)}
                        disabled={outOfStock}
                        className={`px-3 py-1 border rounded-lg text-sm font-medium transition
                          ${outOfStock 
                            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#3674B5] text-white border-[#3674B5]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-[#3674B5] hover:text-white"
                          }`}
                      >
                        {sizeObj.name} ({sizeObj.stock})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded-md"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 border rounded-md"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={
                quantity <= 0 ||
                (selectedSize && product.sizes?.find(s => s.sizeId === Number(selectedSize))?.stock === 0)
              }
              className={`mt-6 w-full px-4 py-3 rounded-md transition-colors ${
                quantity <= 0 ||
                (selectedSize && product.sizes?.find(s => s.sizeId === Number(selectedSize))?.stock === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3674B5] text-white hover:bg-blue-700"
              }`}
            >
              {LoggedUser ? "Add to Cart" : "Login to Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Similar products */}
      <SimilarProducts products={similarProducts} />
    </div>
  );
};

export default ProductDetail;
