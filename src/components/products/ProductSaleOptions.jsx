import React from 'react';

const ProductSaleOptions = ({ formData, handleChange }) => {
  const tzOffset = "+03"; // your timezone

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (!value) {
      handleChange({ target: { name, value: "" } });
      return;
    }

    const dateObj = new Date(value);
    const formatted = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}.${String(dateObj.getMilliseconds()).padStart(3, '0')}${tzOffset}`;

    handleChange({ target: { name, value: formatted } });
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          name="onSale"
          checked={formData.onSale}
          onChange={handleChange}
        />
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
            <label className="block mb-1 font-medium">Sale Start</label>
            <input
              type="datetime-local"
              name="saleStart"
              value={formData.saleStart ? formData.saleStart.slice(0, 16) : ""}
              onChange={handleDateChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Sale End</label>
            <input
              type="datetime-local"
              name="saleEnd"
              value={formData.saleEnd ? formData.saleEnd.slice(0, 16) : ""}
              onChange={handleDateChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSaleOptions;
