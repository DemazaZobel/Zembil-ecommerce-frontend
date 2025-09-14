import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axiosConfig";
import ConfirmDialog from "../../components/common/confirmDialog";

// Fetch users function
const fetchUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

function Users() {
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Fetch users
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowConfirm(false);
    },
  });

  // Handlers
  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deleteUserId);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg animate-pulse">Loading users...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">Error: {error.message}</div>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Users List</h2>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">No users found</div>
        ) : (
          data.map((user) => (
            <div key={user.id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">{user.name}</h3>
                <span className="text-sm font-medium text-gray-500">ID: {user.id}</span>
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Role:</span>{" "}
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {user.role || "N/A"}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete Dialog */}
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this user?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default Users;
