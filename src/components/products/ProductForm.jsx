import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  updateProduct,
  fetchProductById,
  fetchProducts,
} from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axiosConfig";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductCategoryType from "./ProductCategoryType";
import ProductImages from "./ProductImages";
import ProductTags from "./ProductTags";
import ProductSizes from "./ProductSizes";
import ProductSaleOptions from "./ProductSaleOptions";
import MessageBox from "../common/MessageBox";

const ProductForm = ({ productId = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { currentProduct, loading, products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    type: "",
    tags: [],
    sizes: [],
    onSale: false,
    saleType: "",
    saleValue: "",
    saleStart: "",
    saleEnd: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  // Fetch sizes
  const { data: sizesData = [] } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => (await API.get("/sizes")).data,
  });

  // Load categories and products
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Load product for edit
  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  // Populate formData when editing
  useEffect(() => {
    if (currentProduct && productId) {
      setFormData({
        name: currentProduct.name || "",
        description: currentProduct.description || "",
        price: currentProduct.price || "",
        categoryId: currentProduct.categoryId || "",
        type: currentProduct.category?.type || "",
        tags: currentProduct.tags || [],
        sizes: currentProduct.productSizes
          ? currentProduct.productSizes.map((ps) => ({
              sizeId: ps.sizeId,
              stock: ps.stock,
            }))
          : [],
        onSale: currentProduct.onSale || false,
        saleType: currentProduct.saleType || "",
        saleValue: currentProduct.saleValue || "",
        saleStart: currentProduct.saleStart
          ? currentProduct.saleStart.slice(0, 16)
          : "",
        saleEnd: currentProduct.saleEnd
          ? currentProduct.saleEnd.slice(0, 16)
          : "",
      });

      if (currentProduct.images) {
        setExistingImages(
          currentProduct.images.map((img) =>
            img.startsWith("http") ? img : `http://localhost:5000/${img}`
          )
        );
      }
    }
  }, [currentProduct, productId]);

  // Set available sizes
  useEffect(() => {
    if (sizesData) setAvailableSizes(sizesData);
  }, [sizesData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "categoryType") {
      const [categoryId, categoryType] = value.split("|");
      setFormData((prev) => ({
        ...prev,
        categoryId,
        type: categoryType,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayChange = (name, value) => {
    if (Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i.length > 0),
      }));
    }
  };

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
        return { ...prev, sizes: [...prev.sizes, { sizeId, stock: parseInt(stock) || 0 }] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      const duplicate = products.find(
        (p) =>
          p.name.toLowerCase().trim() === formData.name.toLowerCase().trim() &&
          p.categoryId === parseInt(formData.categoryId)
      );
      if (duplicate) {
        setMessage("⚠️ A product with this name and category already exists!");
        setMessageType("error");
        return;
      }
    }

    try {
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("type", formData.type);

      data.append("tags", JSON.stringify(formData.tags || []));
      data.append("sizes", JSON.stringify(formData.sizes || []));
      data.append("onSale", formData.onSale ? "true" : "false");

      if (formData.onSale) {
        data.append("saleType", formData.saleType || "");
        data.append("saleValue", formData.saleValue || "");

        if (formData.saleStart) {
          const startDate = new Date(formData.saleStart);
          if (!isNaN(startDate)) data.append("saleStart", startDate.toISOString());
        }
        if (formData.saleEnd) {
          const endDate = new Date(formData.saleEnd);
          if (!isNaN(endDate)) data.append("saleEnd", endDate.toISOString());
        }
      }

      imageFiles.forEach((file) => data.append("images", file));
      if (productId && imagesToDelete.length > 0) {
        data.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      if (productId) {
        await dispatch(updateProduct({ id: productId, formData: data })).unwrap();
        setMessage("✅ Product updated successfully!");
      } else {
        await dispatch(createProduct(data)).unwrap();
        setMessage("✅ Product created successfully!");
      }

      setMessageType("success");
      setTimeout(() => onSuccess && onSuccess(), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <>
      {message && (
        <MessageBox
          message={message}
          type={messageType}
          onClose={() => setMessage(null)}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl w-full max-w-4xl mx-auto p-6 sm:p-8 space-y-8 border border-gray-100 overflow-y-auto max-h-[90vh]"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
          {productId ? "Edit Product" : "Create Product"}
        </h2>

        <div className="space-y-6">
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Information
            </h3>
            <ProductBasicInfo formData={formData} handleChange={handleChange} />
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Category & Type
            </h3>
            <ProductCategoryType
              formData={formData}
              handleChange={handleChange}
              categories={categories}
            />
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Product Images
            </h3>
            <ProductImages
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              handleImageChange={handleImageChange}
              existingImages={existingImages}
              setExistingImages={setExistingImages}
              imagesToDelete={imagesToDelete}
              setImagesToDelete={setImagesToDelete}
            />
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Tags</h3>
            <ProductTags formData={formData} handleArrayChange={handleArrayChange} />
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sizes & Stock</h3>
            <ProductSizes
              formData={formData}
              availableSizes={availableSizes}
              handleSizeStockChange={handleSizeStockChange}
            />
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sale Options</h3>
            <ProductSaleOptions formData={formData} handleChange={handleChange} />
          </section>
        </div>

        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading
              ? "Saving..."
              : productId
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
