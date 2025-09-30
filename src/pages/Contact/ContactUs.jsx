import React, { useState } from "react";
import contactBg from "../../assets/login.png"; // background image

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: "success", message: data.message || "Message sent successfully!" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to send message" });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to send message" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center py-20 -mt-20"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16 text-white relative z-10 mt-8">
          <h2 className="text-4xl font-extrabold">Contact Zembile</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto -mt-12">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 sm:p-12 transition-transform transform hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none transition"
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg transform transition ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>

            {/* Feedback toast */}
            {feedback.message && (
              <div
                className={`mt-6 p-4 rounded-xl text-white font-medium text-center ${
                  feedback.type === "success" ? "bg-green-500" : "bg-red-500"
                } animate-fadeIn`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tailwind animation for fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
