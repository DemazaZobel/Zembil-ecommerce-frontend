import React, { useState, useEffect } from 'react';

const ProductTags = ({ formData, handleArrayChange }) => {
  const [inputValue, setInputValue] = useState("");

  // Sync inputValue when editing a product
  useEffect(() => {
    setInputValue(formData.tags.join(", "));
  }, [formData.tags]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const tagsArray = inputValue
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    handleArrayChange("tags", tagsArray);
  };

  return (
    <input
      type="text"
      name="tags"
      placeholder="Tags (comma-separated)"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur} // update formData on blur
      className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
    />
  );
};

export default ProductTags;
