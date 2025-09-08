import React from "react";
import { Link } from "react-router-dom";

const SimilarProducts = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="mt-16 text-gray-500">
        <p>No similar products found.</p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                {p.name}
              </h3>
              <p className="text-primary font-bold">${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
