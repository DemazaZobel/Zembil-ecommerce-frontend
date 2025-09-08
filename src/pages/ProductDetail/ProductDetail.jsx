import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "../../data/productsData.js";
import ReviewSection from "../../components/products/ReviewSection.jsx";
import SimilarProducts from "../../components/products/SimilarProducts.jsx";

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const allProducts = Object.values(products).flat();
  const product = allProducts.find((p) => p.id.toString() === id);

  const [mainImage, setMainImage] = useState(product?.image);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <h2 className="text-center py-10">Product not found 😢</h2>;
  }

  const similarProducts =
    products[product.category]?.filter((p) => p.id !== product.id) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image gallery */}
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow-md mb-4"
          />
          <div className="grid grid-cols-3 gap-4">
            {[product.image, ...(product.otherImages || [])].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name}-${idx}`}
                className={`h-20 w-full object-cover rounded-md cursor-pointer border-2 ${
                  mainImage === img ? "border-primary" : "border-gray-200"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="mt-2 text-gray-600">{product.description || "No description available."}</p>
            <p className="mt-2 text-sm text-gray-500">
              Category: {product.category || "N/A"}
            </p>
            <p className="mt-2 text-xl font-bold text-primary">
              ${product.price || 0}
            </p>

            {/* Size selection */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Select Size:</h3>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "bg-primary text-white"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
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

            {/* Add to cart */}
            <button
              onClick={() => onAddToCart({ ...product, quantity })}
              className="mt-6 w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-secondary transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <ReviewSection initialReviews={product.reviews || []} />

      {/* Similar products */}
      <SimilarProducts products={similarProducts} />
    </div>
  );
};

export default ProductDetail;
