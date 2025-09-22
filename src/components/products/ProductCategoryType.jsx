import React from "react";

const ProductCategoryType = ({ formData, handleChange, categories }) => {
  return (
    <div>
      <select
        name="categoryType"
        value={formData.categoryId && formData.type ? `${formData.categoryId}|${formData.type}` : ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        required
      >
        <option value="">Select Category (Type)</option>
        {categories.map((c) => (
          <option
            key={c.id}
            value={`${c.id}|${c.type}`}
          >
            {c.name} ({c.type})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductCategoryType;
