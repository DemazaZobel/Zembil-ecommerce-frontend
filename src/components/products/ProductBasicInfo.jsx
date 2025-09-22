import React from 'react';


const ProductBasicInfo = ({ formData, handleChange }) => (
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
    <textarea
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 col-span-2"
    />
  </div>
);

export default ProductBasicInfo;
