// import React, { useState } from "react";
// import API from "../../api/axiosConfig";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const Products = () => {
//   const queryClient = useQueryClient();

//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Fetch categories
//   const { data: categories = [] } = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await API.get("/categories");
//       return res.data;
//     },
//   });

//   // Fetch products
//   const { data: products = [], isLoading } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await API.get("/products");
//       return res.data;
//     },
//   });

//   // Add or Update product mutation
//   const saveProductMutation = useMutation({
//     mutationFn: async (product) => {
//       if (editingProduct) {
//         return await API.put(`/products/${editingProduct.id}`, product);
//       } else {
//         return await API.post("/products", product);
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["products"]);
//       setName("");
//       setPrice("");
//       setCategoryId("");
//       setEditingProduct(null);
//       alert(editingProduct ? "Product updated successfully" : "Product added successfully");
//     },
//     onError: (err) => {
//       alert("Error: " + err.response?.data?.message || err.message);
//     },
//   });

//   // Delete product mutation
//   const deleteProductMutation = useMutation({
//     mutationFn: async (id) => await API.delete(`/products/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["products"]);
//       alert("Product deleted successfully");
//     },
//     onError: (err) => {
//       alert("Error: " + err.response?.data?.message || err.message);
//     },
//   });

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setName(product.name);
//     setPrice(product.price);
//     setCategoryId(product.categoryId);
//   };

//   const handleSave = () => {
//     if (!name || !price || !categoryId) return alert("All fields are required");
//     saveProductMutation.mutate({ name, price, categoryId });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       deleteProductMutation.mutate(id);
//     }
//   };

//   return (
//     <div className="p-8 bg-gradient-to-br from-blue-50 via-green-50 to-gray-50 min-h-screen">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
//         Manage Products
//       </h1>

//       {/* Add / Edit Product Form */}
//       <div className="mb-6 flex flex-wrap gap-3 items-center justify-center bg-white p-4 rounded-lg shadow-md">
//         <input
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           type="number"
//           className="border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <select
//           value={categoryId}
//           onChange={(e) => setCategoryId(e.target.value)}
//           className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="">Select Category</option>
//           {categories.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleSave}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
//         >
//           {editingProduct ? "Update Product" : "Add Product"}
//         </button>

//         {editingProduct && (
//           <button
//             onClick={() => {
//               setEditingProduct(null);
//               setName("");
//               setPrice("");
//               setCategoryId("");
//             }}
//             className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-md transition"
//           >
//             Cancel
//           </button>
//         )}
//       </div>

//       {/* Products Table */}
//       {isLoading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {products.map((p) => (
//                 <tr key={p.id} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 whitespace-nowrap">{p.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">${p.price}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{p.category?.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEdit(p)}
//                       className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(p.id)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {products.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center p-4 text-gray-500">
//                     No products found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;
import React, { useState } from "react";
import API from "../../api/axiosConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Products = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await API.get("/products");
      return res.data;
    },
  });

  // Add / Update product mutation
  const saveProductMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("categoryId", categoryId);

      images.forEach((file) => formData.append("images", file));

      if (editingProduct) {
        return await API.put(`/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        return await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setName("");
      setPrice("");
      setCategoryId("");
      setImages([]);
      setEditingProduct(null);
      alert(editingProduct ? "Product updated successfully" : "Product added successfully");
    },
    onError: (err) => {
      alert("Error: " + err.response?.data?.message || err.message);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      alert("Product deleted successfully");
    },
    onError: (err) => {
      alert("Error: " + err.response?.data?.message || err.message);
    },
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategoryId(product.categoryId);
    setImages([]); // reset images, admin can upload new ones
  };

  const handleSave = () => {
    if (!name || !price || !categoryId) return alert("All fields are required");
    saveProductMutation.mutate();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  // Helper to normalize images into an array
  const normalizeImages = (imgField) => {
    if (!imgField) return [];
    return Array.isArray(imgField) ? imgField : imgField.split(",");
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-green-50 to-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Manage Products</h1>

      {/* Add / Edit Product Form */}
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-center bg-white p-4 rounded-lg shadow-md">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          className="border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setName("");
              setPrice("");
              setCategoryId("");
              setImages([]);
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-md transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {normalizeImages(p.images).length > 0 ? (
                      normalizeImages(p.images).map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:5000/uploads/${img}`}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${p.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.category?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
