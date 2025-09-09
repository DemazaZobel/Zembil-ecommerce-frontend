import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  clearCurrentCategory,
  deleteCategory,
} from "../../features/category/categorySlice";
import CategoryForm from "../../components/products/categoryForm";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const CategoryDashboard = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // For confirmation dialog
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (id) => {
    setEditingCategoryId(id);
    setShowForm(true);
  };

  const handleCreate = () => {
    dispatch(clearCurrentCategory());
    setEditingCategoryId(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    dispatch(fetchCategories()); // Refresh list every time modal closes
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteCategory(deleteCategoryId)).unwrap();
      setDeleteCategoryId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteCategoryId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary">Category Dashboard</h1>

      <button
        className="bg-secondary text-white px-4 py-2 rounded-md mt-4 hover:opacity-90"
        onClick={handleCreate}
      >
        Create New Category
      </button>

      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-3 text-left">ID</th>
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Type</th>
            <th className="py-2 px-3 text-left">Age</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2 px-3">{c.id}</td>
              <td className="py-2 px-3">{c.name}</td>
              <td className="py-2 px-3">{c.type || "-"}</td>
              <td className="py-2 px-3">{c.age || "-"}</td>
              <td className="py-2 px-3 flex gap-2">
                <button
                  className="bg-primary text-white px-3 py-1 rounded-md hover:opacity-90"
                  onClick={() => handleEdit(c.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:opacity-90"
                  onClick={() => setDeleteCategoryId(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal / Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleFormClose}
        >
          <div
            className="bg-white p-6 rounded-lg w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <CategoryForm
              categoryId={editingCategoryId}
              onSuccess={handleFormClose}
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {deleteCategoryId && (
        <ConfirmDialog
          message="Are you sure you want to delete this category?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default CategoryDashboard;
