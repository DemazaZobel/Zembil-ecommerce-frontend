import React from 'react';
const ProductSizes = ({ formData, availableSizes, handleSizeStockChange }) => (
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
);

export default ProductSizes;
