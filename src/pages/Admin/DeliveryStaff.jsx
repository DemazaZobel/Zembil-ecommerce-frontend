// src/pages/delivery/DeliveryStaff.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  fetchZones,
} from "../../features/delivery/deliverySlice";
import { FaEdit, FaTrash } from "react-icons/fa";

const DeliveryStaff = () => {
  const dispatch = useDispatch();
  const { staff = [], zones = [], loading, error } = useSelector(
    (state) => state.delivery || {}
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    zoneId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loadingAction, setLoadingAction] = useState(false);

  // Fetch staff and zones initially
  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchZones());
  }, [dispatch]);

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Handle add/update staff
 const handleSubmit = async (e) => {
  e.preventDefault();
  setAlert({ type: "", message: "" });
  setLoadingAction(true);

  if (!form.name || !form.email || !form.zoneId) {
    setAlert({ type: "error", message: "⚠️ Please fill all required fields" });
    setLoadingAction(false);
    return;
  }

  // Check if email already exists (excluding current editing staff)
  const emailExists = staff.some(
    (s) => s.email.toLowerCase() === form.email.trim().toLowerCase() && s.id !== editingId
  );
  if (emailExists) {
    setAlert({ type: "error", message: "⚠️ This email is already assigned to another staff" });
    setLoadingAction(false);
    return;
  }

  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    zoneId: Number(form.zoneId),
  };

  try {
    if (editingId) {
      await dispatch(updateStaff({ id: editingId, payload })).unwrap();
      setAlert({ type: "success", message: "Staff updated successfully" });
    } else {
      await dispatch(addStaff(payload)).unwrap();
      setAlert({ type: "success", message: "Staff added successfully. Credentials sent!" });
    }

    setForm({ name: "", email: "", zoneId: "" });
    setEditingId(null);

    // Refresh staff list automatically
    dispatch(fetchStaff());
  } catch (err) {
    setAlert({ type: "error", message: err.message || "Failed to perform action" });
  } finally {
    setLoadingAction(false);
  }
};

  // Handle edit form
  const handleEdit = (staffMember) => {
    setForm({
      name: staffMember.name,
      email: staffMember.email,
      zoneId: staffMember.zoneId,
    });
    setEditingId(staffMember.id);
    setAlert({ type: "", message: "" });
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", zoneId: "" });
    setEditingId(null);
    setAlert({ type: "", message: "" });
  };

  // Modern delete confirmation
  const handleDelete = async (id) => {
    if (!window.confirm) return; // fallback
    setLoadingAction(true);
    try {
      await dispatch(deleteStaff(id)).unwrap();
      setAlert({ type: "success", message: "Staff deleted successfully" });
      dispatch(fetchStaff()); // Refresh automatically
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Failed to delete staff" });
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        🚚 Manage Delivery Staff
      </h1>

      {/* Alerts */}
      {alert.message && (
        <div
          className={`mb-4 p-3 rounded-lg shadow-sm ${
            alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Full Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={form.zoneId}
          onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Zone *</option>
          {zones.map((z) => {
            const isAssigned = staff.some(
              (s) => s.zoneId === z.id && s.id !== editingId
            );
            return (
              <option key={z.id} value={z.id} disabled={isAssigned}>
                {z.name} {z.areas ? `(${z.areas})` : ""} {isAssigned ? "(Assigned)" : ""}
              </option>
            );
          })}
        </select>

        <div className="flex gap-3 col-span-full mt-4">
          <button
            type="submit"
            disabled={loadingAction}
            className={`bg-green-600 text-white px-5 py-2 rounded-lg transition shadow-md ${
              loadingAction ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {editingId ? "Update Staff" : loadingAction ? "Adding..." : "Add Staff"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg shadow-lg">
          <thead className="bg-blue-50 sticky top-0">
            <tr>
              <th className="p-3 border-b text-left">ID</th>
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Email</th>
              <th className="p-3 border-b text-left">Role</th>
              <th className="p-3 border-b text-left">Zone</th>
              <th className="p-3 border-b text-left">Zone Area</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => (
              <tr
                key={s.id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="p-3 border-b">{s.id}</td>
                <td className="p-3 border-b">{s.name}</td>
                <td className="p-3 border-b">{s.email}</td>
                <td className="p-3 border-b">delivery</td>
                <td className="p-3 border-b">{s.zone?.name || "N/A"}</td>
                <td className="p-3 border-b">{s.zone?.areas || "N/A"}</td>
                <td className="p-3 border-b flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                  >
                    <FaEdit /> 
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={loadingAction}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <FaTrash /> 
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No staff found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryStaff;
