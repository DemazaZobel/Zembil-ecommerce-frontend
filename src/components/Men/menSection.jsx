import React, { useState } from "react";
import { Link } from "react-router-dom";
import menmain from "../../assets/Men/menmain.jpg";
import men1 from "../../assets/Men/men1.jpg";
import men2 from "../../assets/Men/men2.jpg";
import men3 from "../../assets/Men/men3.jpg";
import men4 from "../../assets/Men/men4.jpg";
import { FaArrowRight, FaShoppingBag } from "react-icons/fa";

export default function MenSection() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const categories = [
    { name: "Casual Wear", count: "24 items" },
    { name: "Formal Attire", count: "18 items" },
    { name: "Accessories", count: "12 items" },
    { name: "Footwear", count: "16 items" },
  ];

  const images = [
    { src: menmain, alt: "Men's main fashion", colSpan: 3, rowSpan: 2 },
    { src: men1, alt: "Men's fashion 1", colSpan: 1, rowSpan: 1 },
    { src: men2, alt: "Men's fashion 2", colSpan: 1, rowSpan: 1 },
    { src: men3, alt: "Men's fashion 3", colSpan: 1, rowSpan: 1 },
    { src: men4, alt: "Men's fashion 4", colSpan: 1, rowSpan: 1 },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white text-center overflow-hidden">
      {/* Title + Slogan */}
      <div className="mb-12 md:mb-16 px-4">
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Collection
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Men's Fashion
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the perfect blend of <span className="text-[#3674B5] font-medium">style, comfort, and confidence</span> in our latest collection
        </p>
      </div>

      {/* Category Quick Links */}
      <div className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 px-6 py-3 border border-gray-100 hover:border-[#3674B5]/20 cursor-pointer"
            >
              <h3 className="font-medium text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {/* Big left image */}
          <div 
            className="md:col-span-2 relative group overflow-hidden rounded-2xl cursor-pointer"
            onMouseEnter={() => setHoveredImage(0)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <Link to="/men">
              <div className="relative overflow-hidden rounded-2xl h-80 md:h-[500px]">
                <img
                  src={menmain}
                  alt="Men's main fashion"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8`}>
                  <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-semibold mb-2">New Collection</h3>
                    <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium flex items-center gap-2 mx-auto hover:bg-gray-100 transition-colors">
                      Shop Now <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right 4 images grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
            {[men1, men2, men3, men4].map((image, index) => (
              <div 
                key={index} 
                className="relative group overflow-hidden rounded-2xl cursor-pointer"
                onMouseEnter={() => setHoveredImage(index + 1)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Link to="/men">
                  <div className="relative overflow-hidden rounded-2xl h-40 md:h-60">
                    <img
                      src={image}
                      alt={`Men's fashion ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center`}>
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <FaShoppingBag className="text-gray-800" />
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
      <div className="mt-12 md:mt-16 px-4">
        <Link
          to="/men"
          className="inline-flex items-center gap-2 bg-[#3674B5] text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Explore Full Collection
          <FaArrowRight />
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="hidden lg:block absolute left-0 -translate-x-1/2 top-1/4 w-72 h-72 bg-[#3674B5]/5 rounded-full blur-3xl -z-10"></div>
      <div className="hidden lg:block absolute right-0 translate-x-1/2 bottom-1/4 w-96 h-96 bg-[#3674B5]/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}