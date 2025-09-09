import React, { useState } from "react";

const DeliveryProfile = () => {
  // Sample state for delivery user info
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "Addis Ababa, Bole",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Here you would call your API to save changes
    alert("Profile updated successfully!");
    setEditMode(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          My Profile
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Name:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-800">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email:</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-800">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Phone:</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-800">{profile.phone}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Address:</label>
            {editMode ? (
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-800">{profile.address}</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg mr-4 hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;