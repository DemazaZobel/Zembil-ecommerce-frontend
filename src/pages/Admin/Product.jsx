import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, clearCurrentProduct } from "../../features/product/productSlice";
import ProductForm from "../../components/products/ProductForm";

const ProductDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (id) => {
    setEditingProductId(id);
    setShowForm(true);
  };

  const handleCreate = () => {
   dispatch(clearCurrentProduct());
    setEditingProductId(null);
    setShowForm(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary">Product Dashboard</h1>

      <button
        className="bg-secondary text-white px-4 py-2 rounded-md mt-4 hover:opacity-90"
        onClick={handleCreate}
      >
        Create New Product
      </button>

      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Price</th>
            <th className="py-2 px-3 text-left">Category</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2 px-3">{p.name}</td>
              <td className="py-2 px-3">${p.price}</td>
              <td className="py-2 px-3">{p.category?.name}</td>
              <td className="py-2 px-3">
                <button
                  className="bg-primary text-white px-3 py-1 rounded-md hover:opacity-90"
                  onClick={() => handleEdit(p.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal / Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[500px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductForm productId={editingProductId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;
