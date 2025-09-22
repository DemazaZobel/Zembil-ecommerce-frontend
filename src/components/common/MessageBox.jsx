// src/components/common/MessageBox.jsx
import React from "react";

const MessageBox = ({ message, type = "success", onClose }) => {
  const bgColor =
    type === "success"
      ? "bg-green-100 text-green-800"
      : type === "error"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className={`fixed top-20 right-5 px-6 py-4 rounded-lg shadow-md z-50 ${bgColor}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 font-bold text-lg leading-none hover:opacity-70"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
