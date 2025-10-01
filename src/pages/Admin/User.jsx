// src/pages/admin/UsersDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, updateUser, deleteUser } from "../../features/user/userSlice";
import { getAllUsers } from "../../api/userApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersDashboard = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [users, setUsers] = React.useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Delete user with toast confirmation
  const handleDelete = (user) => {
    toast.info(
      <div>
        Are you sure you want to delete <b>{user.name}</b>?
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => {
              dispatch(deleteUser(user.id));
              setUsers((prev) => prev.filter((u) => u.id !== user.id));
              toast.dismiss();
              toast.success("User deleted successfully");
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // Update user role
  const handleUpdateRole = (userId, newRole) => {
    dispatch(updateUser({ userId, userData: { role: newRole } }));
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
    toast.success(`Role updated to ${newRole}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg animate-pulse">Loading users...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Users List</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">No users found</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
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
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() =>
                    handleUpdateRole(user.id, user.role === "admin" ? "user" : "admin")
                  }
                >
                  Change Role
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersDashboard;
