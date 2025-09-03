import React, { useRef, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaStar, FaRegStar } from "react-icons/fa";
import tshirt from "../../assets/tshirt.jpg";
import jeans from "../../assets/jeans.jpg";
import dress from "../../assets/dress.jpg";
import jacket from "../../assets/jacket.jpg";
const saleItems = [
  {
    id: 1,
    name: "Premium T-Shirt",
    price: 20,
    discount: "10% OFF",
    description: "Comfortable cotton t-shirt available in multiple colors.",
    rating: 4,
    image: tshirt,
  },
  {
    id: 2,
    name: "Designer Jeans",
    price: 40,
    discount: "15% OFF",
    description: "Slim fit jeans for everyday casual wear.",
    rating: 5,
    image: jeans,
  },
  {
    id: 3,
    name: "Winter Jacket",
    price: 60,
    discount: "20% OFF",
    description: "Warm and stylish jacket for winter seasons.",
    rating: 3,
    image: jacket,
  },
  {
    id: 4,
    name: " Dress",
    price: 80,
    discount: "25% OFF",
    description: "Comfortable Dress perfect for events.",
    rating: 4,
    image: dress,
  },
  {
    id: 5,
    name: "Casual T-Shirt",
    price: 22,
    discount: "12% OFF",
    description: "Comfortable cotton t-shirt available in multiple colors.",
    rating: 4,
    image: tshirt,
  },
  {
    id: 6,
    name: "Classic Jeans",
    price: 45,
    discount: "18% OFF",
    description: "Slim fit jeans for everyday casual wear.",
    rating: 5,
    image: jeans,
  },
  {
    id: 7,
    name: "Autumn Jacket",
    price: 65,
    discount: "22% OFF",
    description: "Warm and stylish jacket for winter seasons.",
    rating: 3,
    image: jacket,
  },
  {
    id: 8,
    name: "Sport Sneakers",
    price: 85,
    discount: "30% OFF",
    description: "Comfortable sneakers perfect for running and walking.",
    rating: 4,
    image: "https://via.placeholder.com/300x300/3674B5/ffffff?text=Sneakers",
  },
];

const SalesSection = () => {
  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);

  const scrollAmount = () => {
    if (!scrollRef.current) return 300;
    const width = scrollRef.current.clientWidth;
    return Math.floor(width * 0.7); // Scroll 70% of visible width
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollAmount();
      scrollRef.current.scrollBy({
        left: direction === "right" ? amount : -amount,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll
  useEffect(() => {
    scrollInterval.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 3000);

    return () => clearInterval(scrollInterval.current);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3674B5]">
          Hot Sales
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 sm:p-3 bg-[#3674B5] text-white rounded-full hover:bg-blue-700 transition"
            aria-label="Scroll left"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 sm:p-3 bg-[#3674B5] text-white rounded-full hover:bg-blue-700 transition"
            aria-label="Scroll right"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Scrollable Products */}
      <div
        ref={scrollRef}
        className="flex flex-nowrap space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 md:py-4"
        onMouseEnter={() => clearInterval(scrollInterval.current)}
        onMouseLeave={() => {
          scrollInterval.current = setInterval(() => {
            if (scrollRef.current) {
              const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
              if (scrollLeft >= scrollWidth - clientWidth - 10) {
                scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
              } else {
                scroll("right");
              }
            }
          }, 3000);
        }}
      >
        {saleItems.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
          >
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-24 p-4 sm:h-80 md:h-52 lg:h-80  transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {item.discount}
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">
                {item.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-1 line-clamp-2 h-8 md:h-10">
                {item.description}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) =>
                  i < item.rating ? (
                    <FaStar key={i} className="text-yellow-400 mr-1 text-xs sm:text-sm" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-300 mr-1 text-xs sm:text-sm" />
                  )
                )}
                <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[#3674B5] font-bold text-base sm:text-lg">
                    ${item.price}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ${Math.round(item.price / (1 - parseInt(item.discount) / 100))}
                  </span>
                </div>
                <button className="text-xs sm:text-sm bg-[#3674B5] text-white px-2 sm:px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SalesSection;
