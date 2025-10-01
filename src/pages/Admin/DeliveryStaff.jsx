// src/pages/delivery/DeliveryStaff.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaff,
  fetchStaffAdmin,
  addStaffAdmin,
  updateStaffAdmin,
  deleteStaffAdmin,
  fetchZones,
} from "../../features/delivery/deliverySlice";
import { FaEdit, FaTrash } from "react-icons/fa";

// ----------------- Modern Toast Component -----------------
const Toast = ({ type, message, onClose }) => (
  <div
    className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-lg shadow-lg text-white transition-all ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <div className="flex justify-between items-center gap-4">
      <span>{message}</span>
      <button onClick={onClose} className="font-bold hover:opacity-80">
        ✕
      </button>
    </div>
  </div>
);

// ----------------- Confirmation Modal -----------------
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <p className="mb-4 text-gray-800">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const DeliveryStaff = () => {
  const dispatch = useDispatch();
  const { staff = [], zones = [], loading, error } = useSelector(
    (state) => state.delivery || {}
  );

  const [form, setForm] = useState({ name: "", email: "", zoneId: "" });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null); // {type: "success"/"error", message: "..." }
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // ID of staff to delete

  const isAdmin = window.location.pathname.startsWith("/admin");

  // Fetch staff & zones
  useEffect(() => {
    if (isAdmin) dispatch(fetchStaffAdmin());
    else dispatch(fetchStaff());
    dispatch(fetchZones());
  }, [dispatch, isAdmin]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Add / Update staff (Admin only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);

    if (!form.name || !form.email || !form.zoneId) {
      setToast({ type: "error", message: "⚠️ Please fill all required fields" });
      setLoadingAction(false);
      return;
    }

    const emailExists = staff.some(
      (s) => s.email.toLowerCase() === form.email.trim().toLowerCase() && s.id !== editingId
    );
    if (emailExists) {
      setToast({ type: "error", message: "⚠️ This email is already assigned to another staff" });
      setLoadingAction(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      zoneId: Number(form.zoneId),
    };

    try {
      if (!isAdmin) return;

      if (editingId) {
        await dispatch(updateStaffAdmin({ id: editingId, payload })).unwrap();
        setToast({ type: "success", message: "Staff updated successfully" });
      } else {
        await dispatch(addStaffAdmin(payload)).unwrap();
        setToast({ type: "success", message: "Staff added successfully. Credentials sent!" });
      }

      setForm({ name: "", email: "", zoneId: "" });
      setEditingId(null);
      dispatch(fetchStaffAdmin());
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to perform action" });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEdit = (staffMember) => {
    if (!isAdmin) return;
    setForm({ name: staffMember.name, email: staffMember.email, zoneId: staffMember.zoneId });
    setEditingId(staffMember.id);
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", zoneId: "" });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    setDeleteTarget(id); // Show confirmation modal
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoadingAction(true);
    try {
      await dispatch(deleteStaffAdmin(deleteTarget)).unwrap();
      setToast({ type: "success", message: "Staff deleted successfully" });
      dispatch(fetchStaffAdmin());
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete staff" });
    } finally {
      setLoadingAction(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        🚚 Manage Delivery Staff
      </h1>

      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          message="Are you sure you want to delete this staff?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Admin Form */}
      {isAdmin && (
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
              const isAssigned = staff.some((s) => s.zoneId === z.id && s.id !== editingId);
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
      )}

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
              {isAdmin && <th className="p-3 border-b text-center">Actions</th>}
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
                {isAdmin && (
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
                )}
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="text-center p-6 text-gray-500">
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
