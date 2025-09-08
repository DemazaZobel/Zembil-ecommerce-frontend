import React, { useState } from "react";
import API from "../../api/axiosConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Sizes = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [editingSize, setEditingSize] = useState(null);

  // Fetch sizes
  const { data: sizes = [], isLoading } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const res = await API.get("/sizes");
      return res.data;
    },
  });

  // Add / Update mutation
  const saveSizeMutation = useMutation({
    mutationFn: async (size) => {
      if (editingSize) {
        return await API.put(`/sizes/${editingSize.id}`, size);
      } else {
        return await API.post("/sizes", size);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sizes"]);
      setName("");
      setEditingSize(null);
      alert(editingSize ? "Size updated successfully" : "Size added successfully");
    },
    onError: (err) => {
      alert("Error: " + err.response?.data?.message || err.message);
    },
  });

  // Delete mutation
  const deleteSizeMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/sizes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["sizes"]);
      alert("Size deleted successfully");
    },
    onError: (err) => {
      alert("Error: " + err.response?.data?.message || err.message);
    },
  });

  const handleSave = () => {
    if (!name) return alert("Size name is required");
    saveSizeMutation.mutate({ name });
  };

  const handleEdit = (size) => {
    setEditingSize(size);
    setName(size.name);
  };

  const handleCancel = () => {
    setEditingSize(null);
    setName("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      deleteSizeMutation.mutate(id);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Manage Sizes</h1>

      {/* Add / Edit Size Form */}
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-center bg-white p-4 rounded-lg shadow-md">
        <input
          placeholder="Size Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          {editingSize ? "Update Size" : "Add Size"}
        </button>
        {editingSize && (
          <button
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-md transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Sizes Table */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sizes.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">{s.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sizes.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No sizes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sizes;
