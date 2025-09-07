import React, { useState } from "react";
import { Link } from "react-router-dom";
import womenmain from "../../assets/women/womenmain.png";
import women1 from "../../assets/women/women1.png";
import women2 from "../../assets/women/women2.jpg";
import women3 from "../../assets/women/women3.jpg";
import women4 from "../../assets/women/women4.jpg";
import { FaArrowRight, FaShoppingBag, FaHeart } from "react-icons/fa";

export default function WomenSection() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const categories = [
    { name: "Dresses", count: "32 items" },
    { name: "Tops & Blouses", count: "28 items" },
    { name: "Accessories", count: "19 items" },
    { name: "Footwear", count: "24 items" },
  ];

  const stats = [
    { number: "500+", label: "Styles" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "2024", label: "New Collection" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 text-center overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      {/* Title + Slogan */}
      <div className="mb-12 md:mb-16 px-4 relative z-10">
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
            Premium Collection
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Women's Fashion
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Embrace your elegance with our collection designed for <span className="text-blue-600 font-medium">comfort, confidence, and style</span>
        </p>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">{stat.number}</div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 px-6 py-3 border border-blue-100 hover:border-blue-300 cursor-pointer hover:-translate-y-1"
            >
              <h3 className="font-medium text-gray-800">{category.name}</h3>
              <p className="text-sm text-blue-500 mt-1">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-6 items-stretch">
          {/* Left Column - 2 images */}
          <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
            {[womenmain, women1].map((image, index) => (
              <div 
                key={index} 
                className="relative group overflow-hidden rounded-2xl cursor-pointer"
                onMouseEnter={() => setHoveredImage(`left-${index}`)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Link to="/women">
                  <div className="relative overflow-hidden rounded-2xl h-48 md:h-64">
                    <img
                      src={image}
                      alt={`Women's fashion ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center`}>
                      <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-lg font-semibold bg-blue-600/90 px-4 py-2 rounded-full">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Center Column - Big image */}
          <div 
            className="md:col-span-3 relative group overflow-hidden rounded-2xl cursor-pointer"
            onMouseEnter={() => setHoveredImage("center")}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <Link to="/women">
              <div className="relative overflow-hidden rounded-2xl h-80 md:h-[500px]">
                <img
                  src={women2}
                  alt="Women's main fashion"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center`}>
                  <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xl font-semibold bg-blue-600/90 px-6 py-3 rounded-full">
                      View Collection
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column - 2 images */}
          <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
            {[women4, women3].map((image, index) => (
              <div 
                key={index} 
                className="relative group overflow-hidden rounded-2xl cursor-pointer"
                onMouseEnter={() => setHoveredImage(`right-${index}`)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Link to="/women">
                  <div className="relative overflow-hidden rounded-2xl h-48 md:h-64">
                    <img
                      src={image}
                      alt={`Women's fashion ${index + 3}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center`}>
                      <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-lg font-semibold bg-blue-600/90 px-4 py-2 rounded-full">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 px-4 relative z-10">
        <Link
          to="/women"
          className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Discover the Collection
          <FaArrowRight />
        </Link>
      </div>

      {/* Floating elements */}
      <div className="hidden lg:block absolute left-10 top-1/4 w-6 h-6 bg-blue-300 rounded-full animate-float"></div>
      <div className="hidden lg:block absolute right-20 bottom-1/3 w-4 h-4 bg-blue-200 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
    </section>
  );
}