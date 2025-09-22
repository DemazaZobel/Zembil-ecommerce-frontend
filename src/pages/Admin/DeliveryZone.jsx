// src/pages/delivery/DeliveryZones.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchZones, addZone, updateZone, deleteZone } from "../../features/delivery/deliverySlice";

const DeliveryZones = () => {
  const dispatch = useDispatch();
  const { zones, loading, error } = useSelector((state) => state.delivery);

  const [zoneName, setZoneName] = useState("");
  const [zoneAreas, setZoneAreas] = useState("");
  const [editingZone, setEditingZone] = useState(null);

  useEffect(() => {
    dispatch(fetchZones());
  }, [dispatch]);

  const handleSaveZone = () => {
    if (!zoneName.trim()) return alert("Zone name is required");
    const payload = { name: zoneName, areas: zoneAreas };

    if (editingZone) {
      dispatch(updateZone({ id: editingZone.id, payload }));
    } else {
      dispatch(addZone(payload));
    }

    setZoneName("");
    setZoneAreas("");
    setEditingZone(null);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneAreas(zone.areas || "");
  };

  const handleCancelZone = () => {
    setEditingZone(null);
    setZoneName("");
    setZoneAreas("");
  };

  const handleDeleteZone = (id) => {
    if (window.confirm("Delete this zone?")) dispatch(deleteZone(id));
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Manage Delivery Zones
      </h1>

      {/* Add/Edit Zone */}
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-center bg-white p-4 rounded-lg shadow-md">
        <input
          placeholder="Zone Name"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          placeholder="Areas (comma separated)"
          value={zoneAreas}
          onChange={(e) => setZoneAreas(e.target.value)}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSaveZone}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          {editingZone ? "Update Zone" : "Add Zone"}
        </button>
        {editingZone && (
          <button
            onClick={handleCancelZone}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-md transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Zones Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Areas</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zones.map((zone) => (
              <tr key={zone.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">{zone.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{zone.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {zone.areas || "No areas added"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                  <button
                    onClick={() => handleEditZone(zone)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {zones.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No zones found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryZones;
