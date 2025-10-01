import React, { useRef, useState, useEffect } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";

const ProductImages = ({
  imageFiles,
  setImageFiles,
  handleImageChange,
  existingImages = [],
  setExistingImages,
  imagesToDelete,
  setImagesToDelete,
}) => {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  // Merge existing images and new previews
  useEffect(() => {
    const newPreviews = [
      // Ensure existing images always have full URL
      ...existingImages.map((img) =>
        img.startsWith("http") ? img : `http://localhost:5000/${img}`
      ),
      // Local previews for new files
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ];
    setPreviews(newPreviews);
  }, [existingImages, imageFiles]);

  const handleRemove = (index) => {
    if (index < existingImages.length) {
      const removed = existingImages[index];
      setExistingImages(existingImages.filter((_, i) => i !== index));
      setImagesToDelete([...imagesToDelete, removed]);
    } else {
      const fileIndex = index - existingImages.length;
      const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
      setImageFiles(newFiles);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <label className="block mb-2 font-medium text-gray-700">Upload Images</label>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={triggerFileInput}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        <FaUpload /> Choose Files
      </button>

      <div className="flex flex-wrap gap-4">
        {previews.map((src, idx) => (
          <div
            key={idx}
            className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gray-300"
          >
            <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />

            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
