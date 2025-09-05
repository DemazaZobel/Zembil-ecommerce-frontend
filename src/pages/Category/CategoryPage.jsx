import React, { useState } from "react";
import { products } from "../../data/productsData.js";

const CategoryPage = ({ category }) => {
  const [search, setSearch] = useState("");
  const filtered = products[category].filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 capitalize">{category} Collection</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-3 mb-6 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-yellow-500">⭐ {product.rating}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
