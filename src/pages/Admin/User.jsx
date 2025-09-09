import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axiosConfig";

const fetchUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

function Users() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No users found
          </div>
        ) : (
          data.map((user) => (
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
              <p className="text-gray-600">
                <span className="font-medium">Role:</span>{" "}
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {user.role || "N/A"}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Users;