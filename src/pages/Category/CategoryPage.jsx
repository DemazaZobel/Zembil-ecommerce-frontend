import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productSlice";
import { addToCart, fetchCart } from "../../features/cart/cartSlice";
import ProductsGrid from "../../components/category/ProductsGrid"; // adjust path

const CategoryPage = ({ category }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter by category
  let filtered = products.filter(
    (item) => item.category?.name?.toLowerCase() === category.toLowerCase()
  );

  // Filter by search
  filtered = filtered.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  if (sort === "priceLowHigh") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "priceHighLow") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // Add to cart handler
  const handleAddToCart = async (productId, sizeId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1, sizeId })).unwrap();
      dispatch(fetchCart()); // refresh cart automatically
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-primary">
        {category.charAt(0).toUpperCase() + category.slice(1)} Collection
      </h2>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder={`Search ${category} products...`}
          className="w-full md:w-1/2 p-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center py-10">Loading products...</p>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No products found 😢</p>
      ) : (
        <ProductsGrid
          items={filtered}
          title={category.charAt(0).toUpperCase() + category.slice(1)}
          onAddToCart={handleAddToCart} // pass the function to grid
        />
      )}
    </div>
  );
};

export default CategoryPage;
