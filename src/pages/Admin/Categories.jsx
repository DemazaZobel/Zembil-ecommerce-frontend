import React, { useState } from "react";
import API from "../../api/axiosConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Categories = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
  });

  // Add category
  const addCategoryMutation = useMutation({
    mutationFn: async (newName) => {
      return await API.post("/categories", { name: newName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setName("");
    },
  });

  // Update category
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      return await API.put(`/categories/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditingId(null);
      setEditingName("");
    },
  });

  // Delete category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      return await API.delete(`/categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdate = () => {
    updateCategoryMutation.mutate({ id: editingId, name: editingName });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Manage Categories</h1>

      {/* Add Category */}
      <div className="mb-6 flex gap-2">
        <input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={() => addCategoryMutation.mutate(name)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Add
        </button>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.id}</td>

                <td className="p-3">
                  {editingId === c.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    c.name
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  {editingId === c.id ? (
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteCategoryMutation.mutate(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Categories;
