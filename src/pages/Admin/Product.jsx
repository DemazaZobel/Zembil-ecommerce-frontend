import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  clearCurrentProduct,
  deleteProduct,
} from "../../features/product/productSlice";
import ProductForm from "../../components/products/ProductForm";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { Edit, Trash2, X } from "lucide-react";

const ProductDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [editingProductId, setEditingProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const confirmDelete = (id) => {
    setDeleteProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    await dispatch(deleteProduct(deleteProductId)).unwrap();
    setDeleteDialogOpen(false);
    setDeleteProductId(null);
    dispatch(fetchProducts());
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteProductId(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProductId(null);
    dispatch(fetchProducts());
  };

  // Filter, search, sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (p) => p.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, search, category, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary">Product Dashboard</h1>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-4 items-center">
        <button
          className="bg-secondary text-white px-4 py-2 rounded-md hover:opacity-90"
          onClick={handleCreate}
        >
          Create New Product
        </button>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-48"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {paginatedProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === num + 1 ? "bg-primary text-white" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal / Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>

            <ProductForm productId={editingProductId} onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deleteDialogOpen && (
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

// --------- ProductCard Component with Custom Carousel ---------
const ProductCard = ({ product, onEdit, onDelete }) => {
  const [currentImg, setCurrentImg] = useState(0);

  const nextImage = () => setCurrentImg((prev) => (prev + 1) % product.images.length);
  const prevImage = () =>
    setCurrentImg((prev) => (prev - 1 + product.images.length) % product.images.length);

  const totalStock = product.sizes?.reduce((acc, s) => acc + (s.stock || 0), 0) ?? 0;

  return (
    <div className="bg-white border rounded-lg shadow-md flex flex-col">
      <div className="relative h-80 rounded-t-lg overflow-hidden">
        <img
          src={`http://localhost:5000/${product.images[currentImg]}`}
          alt={product.name}
          className="h-80 w-full object-cover"
        />

        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-500">{product.category?.name || "Uncategorized"}</p>

          <p
            className={`text-sm font-medium mt-1 ${
              totalStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Total Stock: {totalStock}
          </p>

          <div className="mt-2">
            <p className="font-medium text-gray-700">Sizes & Stock:</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {product.sizes?.map((size) => (
                <span
                  key={size.id}
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    size.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {size.name}: {size.stock}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            className="p-2 bg-primary text-white rounded-full hover:opacity-90"
            onClick={() => onEdit(product.id)}
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            onClick={() => onDelete(product.id)}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
