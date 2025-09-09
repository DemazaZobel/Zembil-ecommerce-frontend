// src/components/common/ConfirmDialog.jsx
import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[350px] shadow-lg text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-around gap-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:opacity-90"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 py-2 px-4 rounded hover:opacity-90"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
