import React, { useState } from "react";
import { Link } from "react-router-dom";
import kidmain from "../../assets/kids/kidmain.jpg";
import kid1 from "../../assets/kids/kid1.jpg";
import kid2 from "../../assets/kids/kid2.jpg";
import kid3 from "../../assets/kids/kids3.jpg";
import kid4 from "../../assets/kids/kids4.jpg";

export default function KidsSection() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleImageHover = (index) => {
    setHoveredImage(index);
  };

  const handleImageLeave = () => {
    setHoveredImage(null);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white text-center">
      {/* Title + Slogan */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative inline-block">
          Kids Collection
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-400 rounded-full"></span>
        </h2>
        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
          Discover our playful collection that combines comfort, style, and fun for your little ones
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 max-w-6xl mx-auto px-4 items-center">
        {/* Left 4 small images */}
        <div className="flex flex-col gap-6 sm:col-span-2">
          <div className="flex flex-col gap-6">
            {[kidmain, kid1].map((img, index) => (
              <Link 
                to="/kids" 
                key={index}
                className="relative overflow-hidden group rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => handleImageHover(`left-${index}`)}
                onMouseLeave={handleImageLeave}
              >
                <img
                  src={img}
                  alt="Kids fashion"
                  className={`rounded-2xl object-cover w-full h-40 sm:h-48 transition-transform duration-500 ${
                    hoveredImage === `left-${index}` ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-gray-900 font-medium px-3 py-1 rounded-full text-sm shadow-md">
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {[kid2, kid3].map((img, index) => (
              <Link 
                to="/kids" 
                key={index}
                className="relative overflow-hidden group rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => handleImageHover(`right-${index}`)}
                onMouseLeave={handleImageLeave}
              >
                <img
                  src={img}
                  alt="Kids fashion"
                  className={`rounded-2xl object-cover w-full h-40 sm:h-48 transition-transform duration-500 ${
                    hoveredImage === `right-${index}` ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-gray-900 font-medium px-3 py-1 rounded-full text-sm shadow-md">
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Big right image */}
        <div className="sm:col-span-3">
          <Link 
            to="/kids" 
            className="relative overflow-hidden group block rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
            onMouseEnter={() => handleImageHover('main')}
            onMouseLeave={handleImageLeave}
          >
            <img
              src={kid4}
              alt="Kids main fashion"
              className={`rounded-2xl object-cover w-full h-80 sm:h-[400px] transition-transform duration-700 ${
                hoveredImage === 'main' ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="bg-white text-gray-900 font-medium px-4 py-2 rounded-full text-md shadow-lg">
                Explore Collection
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12">
        <Link
          to="/kids"
          className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <span>View All Kids Items</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </Link>
      </div>
    </section>
  );
}