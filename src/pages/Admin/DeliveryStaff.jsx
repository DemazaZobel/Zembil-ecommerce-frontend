// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import API from "../../api/axiosConfig";

// const DeliveryStaff = () => {
//   const queryClient = useQueryClient();
//   const [form, setForm] = useState({ name: "", zoneId: "" });
//   const [editingId, setEditingId] = useState(null);

//   // Fetch delivery staff
//   const { data: staff = [], isLoading: staffLoading } = useQuery({
//     queryKey: ["staff"],
//     queryFn: async () => (await API.get("/deliverystaff")).data,
//   });

//   // Fetch zones
//   const { data: zones = [], isLoading: zonesLoading } = useQuery({
//     queryKey: ["zones"],
//     queryFn: async () => (await API.get("/deliveryzones")).data,
//   });

//   // Add delivery staff
//   const addMutation = useMutation({
//     mutationFn: async (payload) => API.post("/deliverystaff", payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["staff"]);
//       setForm({ name: "", zoneId: "" });
//     },
//   });

//   // Edit delivery staff
//   const editMutation = useMutation({
//     mutationFn: async ({ id, payload }) => API.put(`/deliverystaff/${id}`, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["staff"]);
//       setForm({ name: "", zoneId: "" });
//       setEditingId(null);
//     },
//   });

//   // Delete delivery staff
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => API.delete(`/deliverystaff/${id}`),
//     onSuccess: () => queryClient.invalidateQueries(["staff"]),
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.name || !form.zoneId) return alert("Please fill all fields");

//     const payload = {
//       name: form.name.trim(),
//       zoneId: Number(form.zoneId),
//     };

//     if (editingId) {
//       editMutation.mutate({ id: editingId, payload });
//     } else {
//       addMutation.mutate(payload);
//     }
//   };

//   const handleEdit = (staffMember) => {
//     setForm({
//       name: staffMember.name,
//       zoneId: staffMember.zoneId,
//     });
//     setEditingId(staffMember.id);
//   };

//   const handleCancel = () => {
//     setForm({ name: "", zoneId: "" });
//     setEditingId(null);
//   };

//   if (staffLoading || zonesLoading) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Manage Delivery Staff</h1>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="mb-6 flex flex-wrap gap-2 items-center bg-white p-4 rounded shadow"
//       >
//         <input
//           type="text"
//           placeholder="Staff Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="border p-2 rounded flex-1 min-w-[200px]"
//         />

//         <select
//           value={form.zoneId}
//           onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
//           className="border p-2 rounded flex-1 min-w-[200px]"
//         >
//           <option value="">Select Zone</option>
//           {zones.map((z) => (
//             <option key={z.id} value={z.id}>
//               {z.name}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
//             addMutation.isLoading || editMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={addMutation.isLoading || editMutation.isLoading}
//         >
//           {editingId ? "Update Staff" : "Add Staff"}
//         </button>

//         {editingId && (
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
//           >
//             Cancel
//           </button>
//         )}
//       </form>

//       {/* Staff Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border rounded-lg shadow">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border-b">ID</th>
//               <th className="p-2 border-b">Name</th>
//               <th className="p-2 border-b">Zone</th>
//               <th className="p-2 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {staff.map((s) => (
//               <tr key={s.id} className="hover:bg-gray-50">
//                 <td className="p-2 border-b">{s.id}</td>
//                 <td className="p-2 border-b">{s.name}</td>
//                 <td className="p-2 border-b">{s.zone?.name || "N/A"}</td>
//                 <td className="p-2 border-b flex gap-2">
//                   <button
//                     onClick={() => handleEdit(s)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteMutation.mutate(s.id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DeliveryStaff;
// src/pages/admin/DeliveryStaff.jsx /
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axiosConfig";
import ConfirmDialog from "../../components/common/confirmDialog.jsx"; //

const DeliveryStaff = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "delivery",
    zoneId: "",
    area: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // Track staff to delete

  // Fetch staff
  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => (await API.get("/deliverystaff")).data,
  });

  // Fetch zones
  const { data: zones = [], isLoading: zonesLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => (await API.get("/deliveryzones")).data,
  });

  // Add staff
  const addMutation = useMutation({
    mutationFn: async (payload) => await API.post("/deliverystaff", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      setForm({ name: "", email: "", password: "", role: "delivery", zoneId: "", area: "" });
    },
  });

  // Edit staff
  const editMutation = useMutation({
    mutationFn: async ({ id, payload }) => await API.put(`/deliverystaff/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      setForm({ name: "", email: "", password: "", role: "delivery", zoneId: "", area: "" });
      setEditingId(null);
    },
  });

  // Delete staff
  const deleteMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/deliverystaff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      setDeleteId(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.zoneId || !form.area) {
      return alert("Please fill all fields");
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      role: form.role,
      zoneId: Number(form.zoneId),
      area: form.area.trim(),
    };

    if (editingId) {
      editMutation.mutate({ id: editingId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      email: s.email,
      password: "",
      role: s.role,
      zoneId: s.zoneId,
      area: s.area,
    });
    setEditingId(s.id);
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", password: "", role: "delivery", zoneId: "", area: "" });
    setEditingId(null);
  };

  if (staffLoading || zonesLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Manage Delivery Staff</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-wrap gap-2 items-center bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <select
          value={form.zoneId}
          onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
          className="border p-2 rounded flex-1 min-w-[150px]"
        >
          <option value="">Select Zone</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Area"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <button
          type="submit"
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
            addMutation.isLoading || editMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={addMutation.isLoading || editMutation.isLoading}
        >
          {editingId ? "Update Staff" : "Add Staff"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Role</th>
              <th className="p-2 border-b">Zone</th>
              <th className="p-2 border-b">Area</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{s.id}</td>
                <td className="p-2 border-b">{s.name}</td>
                <td className="p-2 border-b">{s.email}</td>
                <td className="p-2 border-b">{s.role}</td>
                <td className="p-2 border-b">{s.zone?.name || "N/A"}</td>
                <td className="p-2 border-b">{s.area}</td>
                <td className="p-2 border-b flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(s.id)} // Show confirm dialog
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this staff member?"
          onConfirm={() => deleteMutation.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default DeliveryStaff;
