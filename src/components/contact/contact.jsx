import React from "react";
import { useNavigate } from "react-router-dom";
import contactBg from "../../assets/login.png"; // Replace with your background image

export default function ContactCTA() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[50vh] flex items-center py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* CTA Text */}
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Have Questions or Ideas?
        </h2>
        <p className="text-sm sm:text-base max-w-lg mx-auto mb-6">
          Reach out to Zembile and let's bring Ethiopian fashion to life — stylish, authentic, and made with love.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/contact")}
          className="bg-primary text-white py-3 px-8 rounded-full font-semibold hover:bg-secondary transition-colors shadow-lg"
        >
          Contact Us
        </button>
      </div>
    </section>
  );
}
