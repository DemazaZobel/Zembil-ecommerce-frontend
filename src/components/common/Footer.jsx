import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#2E5F92] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-8 md:space-y-0">
          {/* Logo / Company */}
          <div>
            <h3 className="text-2xl font-bold text-white">Zembil</h3>
            <p className="mt-2 text-white max-w-xs">
              Trendy fashion for Men, Women, and Kids with fast delivery and amazing deals.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/men" className="hover:text-white transition">Men</a>
                </li>
                <li>
                  <a href="/women" className="hover:text-white transition">Women</a>
                </li>
                <li>
                  <a href="/kids" className="hover:text-white transition">Kids</a>
                </li>
                <li>
                  <a href="/sale" className="hover:text-white transition">Sale</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="hover:text-white transition">About Us</a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition">Contact</a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition">FAQ</a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-blue-400 transition text-white">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition text-white">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-blue-700 transition text-white">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-400 pt-6 text-center text-white text-sm">
          &copy; {new Date().getFullYear() } <span className="text-white font-semibold">Zembil. All rights reserved. </span>
        </div>
      </div>
    </footer>
  );
}
