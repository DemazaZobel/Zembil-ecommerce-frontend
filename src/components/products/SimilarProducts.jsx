// src/components/products/SimilarProducts.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SimilarProducts = ({ products }) => {
  const navigate = useNavigate();
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Similar Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="relative overflow-hidden">
              <img
                src={
                  product.images?.[0]
                    ? `http://localhost:5000/${product.images[0]}`
                    : ""
                }
                alt={product.name}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">{product.description}</p>
              )}
              <span className="text-[#3674B5] font-bold text-base sm:text-lg">
                ${product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
