import React from "react";
import Navbar from "../../components/common/Navbar.jsx";
import HeroImage from "../../assets/hanger.png"; // replace with your image
import Sales from "../../components/Sale/sale.jsx";
import NewArrivals from "../../components/New Arrivals/newArivals.jsx";
import WomenSection from "../../components/women/womenSection.jsx";
import MenSection from "../../components/Men/menSection.jsx";
import KidsSection from "../../components/Kids/kidessection.jsx";
import ContactUs from "../../components/contact/contact.jsx";
import { useSelector } from "react-redux";

const Home = () => {
  const { info } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-auto">
    
      {/* Hero Section */}
      <main className="flex-1 -mt-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col-reverse md:flex-row items-center justify-between py-16 md:py-24">
          {/* Left: Text */}
          <div className="md:w-1/2 text-center md:text-left space-y-4 sm:space-y-6 p-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-sans text-[#3674B5] font-bold leading-tight">
                  {info ? (
              <h1 className="text-3xl font-bold text-primary">
                Welcome, {info.name}!
                Zembil Market
              </h1>
            ) : (
              <h1 className="text-4xl ">
                Welcome to Zembil Market
              </h1>
            )}
            </h1>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl lg:text-2xl font-sans leading-relaxed">
              Discover the best fashion for Men, Women, and Kids with fast delivery and amazing deals.
            </p>
            {info ? (<p className="px-6 py-2 sm:px-8 sm:py-3 bg-[#3674B5] text-white font-semibold rounded-2xl hover:bg-blue-700 transition text-base sm:text-lg w-full sm:w-40 text-center"> Happy Shopping! </p>) : (<div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <a
                href="/register"
                className="px-6 py-2 sm:px-8 sm:py-3 bg-[#3674B5] text-white font-semibold rounded-2xl hover:bg-blue-700 transition text-base sm:text-lg w-full sm:w-40 text-center"
              >
                Register
              </a>
              <a
                href="/login"
                className="px-6 py-2 sm:px-8 sm:py-3 border border-[#3674B5] text-[#3674B5] font-semibold rounded-2xl hover:bg-[#3674B5] hover:text-white transition text-base sm:text-lg w-full sm:w-40 text-center"
              >
                Login
              </a>
            </div>)}

          </div>
          
          {/* Right: Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end mb-10 md:mb-0">
            <img
              src={HeroImage}
              alt="Hero"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover"
            />
          </div>
        </section>
      </main>

      {/* Sales Section */}
      <Sales />
      {/* New Arrivals Section */}
     
      <NewArrivals />
      <WomenSection />
      <MenSection />
      <KidsSection />
      <ContactUs />
    </div>
  );
};

export default Home;
