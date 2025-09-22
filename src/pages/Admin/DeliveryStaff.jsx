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
    password: "",
    confirmPassword: "",
    zoneId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchZones());
  }, [dispatch]);

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const { name, email, password, confirmPassword, zoneId } = form;

    if (!name || !email || (!editingId && !password) || !zoneId) {
      setFormError("⚠️ Please fill all required fields");
      return;
    }

    if (!editingId) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setFormError(passwordError);
        return;
      }
      if (password !== confirmPassword) {
        setFormError("⚠️ Passwords do not match");
        return;
      }
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password ? password.trim() : undefined,
      role: "delivery", // always delivery
      zoneId: Number(zoneId),
    };

    if (editingId) {
      dispatch(updateStaff({ id: editingId, payload }));
    } else {
      dispatch(addStaff(payload));
    }

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      zoneId: "",
    });
    setEditingId(null);
  };

  const handleEdit = (staffMember) => {
    setForm({
      name: staffMember.name,
      email: staffMember.email,
      password: "",
      confirmPassword: "",
      zoneId: staffMember.zoneId,
    });
    setEditingId(staffMember.id);
    setFormError("");
  };

  const handleCancel = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      zoneId: "",
    });
    setEditingId(null);
    setFormError("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this staff?")) dispatch(deleteStaff(id));
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        🚚 Manage Delivery Staff
      </h1>

      {formError && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg shadow-sm">
          {formError}
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
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-3 rounded-lg"
        />
        {!editingId && (
          <>
            <input
              type="password"
              placeholder="Password *"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-3 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm Password *"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="border p-3 rounded-lg"
            />
          </>
        )}
        <select
          value={form.zoneId}
          onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Zone *</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} {z.areas ? `(${z.areas})` : ""}
            </option>
          ))}
        </select>

        <div className="flex gap-3 col-span-full mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            {editingId ? "Update Staff" : "Add Staff"}
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
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <FaTrash /> Delete
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
