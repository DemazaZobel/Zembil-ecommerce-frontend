// src/components/products/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct, fetchProductById } from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axiosConfig";

const ProductForm = ({ productId = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    type: "",
    tags: [],
    sizes: [], // array of {sizeId, stock}
    onSale: false,
    saleType: "",
    saleValue: "",
    saleStart: "",
    saleEnd: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  // Fetch all sizes from API
  const { data: sizesData = [] } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const res = await API.get("/sizes");
      return res.data;
    },
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  // Load product data
  useEffect(() => {
    if (currentProduct && productId) {
      setFormData({
        ...currentProduct,
        tags: currentProduct.tags || [],
        sizes: currentProduct.sizes || [],
        saleStart: currentProduct.saleStart ? currentProduct.saleStart.slice(0, 16) : "",
        saleEnd: currentProduct.saleEnd ? currentProduct.saleEnd.slice(0, 16) : "",
      });

      if (currentProduct.images) setImagePreviews(currentProduct.images);
    }
  }, [currentProduct, productId]);

  // Prepare size options
  useEffect(() => {
    if (sizesData) setAvailableSizes(sizesData);
  }, [sizesData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "categoryId") setFormData((prev) => ({ ...prev, type: "" }));
  };

  const handleArrayChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle stock change for each size
  const handleSizeStockChange = (sizeId, stock) => {
    setFormData((prev) => {
      const exists = prev.sizes.find((s) => s.sizeId === sizeId);
      if (exists) {
        return {
          ...prev,
          sizes: prev.sizes.map((s) =>
            s.sizeId === sizeId ? { ...s, stock: parseInt(stock) || 0 } : s
          ),
        };
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, { sizeId, stock: parseInt(stock) || 0 }],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });
      imageFiles.forEach((file) => data.append("images", file));

      if (productId) {
        await dispatch(updateProduct({ id: productId, productData: data })).unwrap();
      } else {
        await dispatch(createProduct(data)).unwrap();
      }
      console.log("Product saved successfully", formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCategory = categories.find((c) => c.id === parseInt(formData.categoryId));
  const types = selectedCategory ? [selectedCategory.type || "Default"] : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto space-y-6"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {productId ? "Edit Product" : "Create Product"}
      </h2>

      {/* Name & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
      />

      {/* Category & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          required
          disabled={!selectedCategory}
        >
          <option value="">Select Type</option>
          {types.map((t, idx) => (
            <option key={idx} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-2 font-medium">Upload Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mb-3" />
        <div className="flex flex-wrap gap-4">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="w-24 h-24 border rounded-lg overflow-hidden relative">
              <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={formData.tags.join(", ")}
        onChange={(e) => handleArrayChange("tags", e.target.value)}
        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
      />

      {/* Sizes with stock */}
      <div className="space-y-2">
        <label className="font-medium">Sizes & Stock</label>
        {availableSizes.map((s) => {
          const existing = formData.sizes.find((sz) => sz.sizeId === s.id);
          return (
            <div key={s.id} className="flex items-center gap-4">
              <span className="w-32">{s.name}</span>
              <input
                type="number"
                min="0"
                placeholder="Stock"
                value={existing ? existing.stock : ""}
                onChange={(e) => handleSizeStockChange(s.id, e.target.value)}
                className="border rounded-lg p-2 w-24 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          );
        })}
      </div>

      {/* Sale Options */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="onSale" checked={formData.onSale} onChange={handleChange} />
        <span className="font-medium">On Sale?</span>
      </div>
      {formData.onSale && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="saleType"
            placeholder="Sale Type (percent/flat)"
            value={formData.saleType}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            step="0.01"
            name="saleValue"
            placeholder="Sale Value"
            value={formData.saleValue}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
          <div>
            <label className="block mb-1">Sale Start</label>
            <input
              type="datetime-local"
              name="saleStart"
              value={formData.saleStart}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1">Sale End</label>
            <input
              type="datetime-local"
              name="saleEnd"
              value={formData.saleEnd}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 mt-4"
      >
        {loading ? "Saving..." : productId ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
