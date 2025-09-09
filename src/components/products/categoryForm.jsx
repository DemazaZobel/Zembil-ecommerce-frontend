import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
  fetchCategoryById,
} from "../../features/category/categorySlice";

const CategoryForm = ({ categoryId = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { currentCategory, loading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({ name: "", type: "", age: "" });

  useEffect(() => {
    if (categoryId) dispatch(fetchCategoryById(categoryId));
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (currentCategory && categoryId) {
      setFormData({
        name: currentCategory.name || "",
        type: currentCategory.type || "",
        age: currentCategory.age || "",
      });
    }
  }, [currentCategory, categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryId) {
        await dispatch(updateCategory({ id: categoryId, data: formData })).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }
      onSuccess(); // refresh table in parent
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">
        {categoryId ? "Edit Category" : "Create Category"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
        required
      />
      <input
        type="text"
        name="type"
        placeholder="Type"
        value={formData.type}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />
      <input
        type="text"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary disabled:opacity-50"
      >
        {loading ? "Saving..." : categoryId ? "Update Category" : "Create Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
