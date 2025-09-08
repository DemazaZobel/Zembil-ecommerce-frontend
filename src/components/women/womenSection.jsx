import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import womenmain from "../../assets/women/womenmain.png";
import women1 from "../../assets/women/women1.png";
import women2 from "../../assets/women/women2.jpg";
import women3 from "../../assets/women/women3.jpg";
import women4 from "../../assets/women/women4.jpg";

export default function WomenSection() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const imageGroups = [
    [womenmain, women1],
    [women2],
    [women4, women3]
  ];

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % imageGroups.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white text-center overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      {/* Title + Slogan */}
      <div className="mb-12 md:mb-16 px-4 relative z-10">
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
            Premium Collection
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Women's Fashion
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Embrace your elegance with our collection designed for{" "}
          <span className="text-primary font-medium">comfort, confidence, and style</span>
        </p>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-16 relative z-10">
        <div className="grid gap-4 md:gap-6">

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-7 md:items-stretch gap-4 md:gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              {imageGroups[0].map((image, index) => (
                <ImageCard key={index} image={image} alt={`Women's fashion ${index + 1}`} />
              ))}
            </div>

            {/* Center Column */}
            <div className="md:col-span-3">
              <ImageCard image={imageGroups[1][0]} alt="Women's main fashion" main />
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              {imageGroups[2].map((image, index) => (
                <ImageCard key={index} image={image} alt={`Women's fashion ${index + 3}`} />
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {/* Main big image */}
            <div className="col-span-2">
              <ImageCard image={imageGroups[1][0]} alt="Women's main fashion" main />
            </div>

            {/* Small images in 2x2 grid */}
            {[...imageGroups[0], ...imageGroups[2]].map((image, index) => (
              <ImageCard key={index} image={image} alt={`Women's fashion ${index + 1}`} />
            ))}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center mt-6 space-x-3">
          {imageGroups.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 px-4 relative z-10">
        <Link
          to="/women"
          className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Discover the Collection
          <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}

// Reusable ImageCard Component
function ImageCard({ image, alt, main = false }) {
  return (
    <Link
      to="/women"
      className="relative group overflow-hidden rounded-2xl cursor-pointer"
    >
      <div className={`relative overflow-hidden rounded-2xl ${main ? "h-80 md:h-[500px]" : "h-48 md:h-64"}`}>
        <img
          src={image}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-700 ${main ? "group-hover:scale-105" : "group-hover:scale-110"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <span className={`text-white font-semibold rounded-full px-4 py-2 ${main ? "text-xl bg-primary px-6 py-3" : "text-lg bg-primary px-4 py-2"}`}>
            {main ? "View Collection" : "View"}
          </span>
        </div>
      </div>
    </Link>
  );
}
