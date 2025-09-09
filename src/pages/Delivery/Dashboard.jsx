import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axiosConfig";

const fetchZones = async () => {
  const res = await API.get("/deliveryzones");
  return res.data;
};

const fetchStaff = async () => {
  const res = await API.get("/deliverystaff");
  return res.data;
};

function DeliveryDashboard() {
  // React Query v5: useQuery requires an object
  const {
    data: zones,
    error: zonesError,
    isLoading: zonesLoading,
  } = useQuery({
    queryKey: ["zones"],
    queryFn: fetchZones,
  });

  const {
    data: staff,
    error: staffError,
    isLoading: staffLoading,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });

  if (zonesLoading || staffLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-xl">Loading...</div>
      </div>
    );

  if (zonesError || staffError)
    return (
      <div className="text-red-500 text-center mt-6">
        Failed to load data. Please try again.
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Delivery Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Delivery Zones */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Zones</h3>
          {zones.length === 0 ? (
            <p className="text-gray-500">No delivery zones available.</p>
          ) : (
            <ul className="space-y-2">
              {zones.map((zone) => (
                <li
                  key={zone.id}
                  className="p-3 border rounded hover:bg-blue-50 transition"
                >
                  {zone.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Delivery Staff */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 text-green-600">Staff</h3>
          {staff.length === 0 ? (
            <p className="text-gray-500">No delivery staff available.</p>
          ) : (
            <ul className="space-y-2">
              {staff.map((member) => (
                <li
                  key={member.id}
                  className="p-3 border rounded hover:bg-green-50 transition"
                >
                  {member.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryDashboard;