import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const cards = [
    { title: "Manage Products", icon: "📦", link: "/admin/products" },
    { title: "Manage Categories", icon: "📂", link: "/admin/categories" },
    { title: "Manage Orders", icon: "🛒", link: "/admin/orders" },
    { title: "Manage Users", icon: "👤", link: "/admin/users" },
    { title: "Manage Delivery Staff", icon: "🚚", link: "/admin/deliverystaff" },
    { title: "Manage Sizes", icon: "📏", link: "/admin/size" },
    { title: "Manage Delivery Zones", icon: "🌍", link: "/admin/deliveryzone" },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-5xl font-extrabold mb-12 text-gray-800 text-center">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-green-600 hover:bg-green-700 transition transform hover:scale-105 duration-300 text-white p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center font-semibold text-lg"
          >
            <span className="text-5xl mb-3">{card.icon}</span>
            <span className="text-center">{card.title}</span>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center text-gray-700 italic">
        🚀 Manage your restaurant, orders, users, and delivery efficiently!
      </div>
    </div>
  );
};

export default Dashboard;
