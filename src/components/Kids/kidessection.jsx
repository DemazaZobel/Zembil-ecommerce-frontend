import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingBag } from "react-icons/fa";

import kidmain from "../../assets/kids/kidmain.jpg";
import kid1 from "../../assets/kids/kid1.jpg";
import kid2 from "../../assets/kids/kid2.jpg";
import kid3 from "../../assets/kids/kids3.jpg";
import kid4 from "../../assets/kids/kids4.jpg";

export default function KidsSection() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const images = [kid1, kid2, kid3, kid4];

  return (
    <section className="py-16 md:py-24 bg-white text-center overflow-hidden relative">
      {/* Title + Slogan */}
      <div className="mb-12 md:mb-16 px-4">
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
            Kid's Collection
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Kids Fashion
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our playful collection that combines{" "}
          <span className="text-primary font-medium">comfort, style, and fun</span> for your little ones
        </p>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-4 md:gap-6 items-stretch">

          {/* Mobile Layout: Main image at top */}
          <div className="col-span-2 md:hidden mb-4">
            <ImageCardMain image={kidmain} />
          </div>

          {/* Mobile Layout: Small images in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {images.map((image, index) => (
              <ImageCardSmall key={index} image={image} />
            ))}
          </div>

          {/* Desktop Layout */}
          {/* Left 4 images grid */}
          <div className="hidden md:grid md:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
            {images.map((image, index) => (
              <ImageCardSmall key={index} image={image} />
            ))}
          </div>

          {/* Big right image */}
          <div className="hidden md:block md:col-span-2">
            <ImageCardMain image={kidmain} />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12 md:mt-16 px-4">
        <Link
          to="/kids"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primaryDark transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Explore Full Collection
          <FaArrowRight />
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="hidden lg:block absolute left-0 -translate-x-1/2 top-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="hidden lg:block absolute right-0 translate-x-1/2 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}

// Main image card component
function ImageCardMain({ image }) {
  return (
    <Link to="/kids" className="relative group overflow-hidden rounded-2xl cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl h-80 md:h-[500px]">
        <img
          src={image}
          alt="Kids main fashion"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
          <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-xl font-semibold mb-2">New Collection</h3>
            <button className="bg-primary text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 mx-auto hover:bg-primaryDark transition-colors">
              Shop Now <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Small image card component
function ImageCardSmall({ image }) {
  return (
    <Link to="/kids" className="relative group overflow-hidden rounded-2xl cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl h-40 md:h-60">
        <img
          src={image}
          alt="Kids fashion"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <FaShoppingBag className="text-gray-800" />
          </div>
        </div>
      </div>
    </Link>
  );
}
