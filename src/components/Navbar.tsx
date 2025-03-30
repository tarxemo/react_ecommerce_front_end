import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle mobile dropdown menu
  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar: Social Media & Contact */}
      <div className={`bg-gray-800 text-white py-2 transition-all duration-300 ${isSticky ? "opacity-0" : "opacity-100"}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors" />
            </a>
          </div>

          {/* Contact Info */}
          <div className="text-sm flex flex-row">
            <span className="hidden md:flex md:flex-row mr-4">Email: support@ecommerceapp.com</span>
            <span>Phone: +123 456 7890</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`bg-gray-900 text-white py-4 sticky top-0 z-50 transition-all duration-300 ${isSticky ? "shadow-lg" : ""}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#FFE31A]">
            EcommerceApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-[#FFE31A] transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-[#FFE31A] transition-colors">
              Products
            </Link>

            {/* Categories Dropdown (Desktop) */}
            <div className="relative">
              <button onClick={toggleDropdown} className="hover:text-[#FFE31A] transition-colors flex items-center">
                Categories
                <svg className={`ml-2 w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 bg-gray-800 text-white py-2 mt-2 rounded-lg shadow-lg w-48">
                  <Link to="/category/electronics" className="block px-4 py-2 hover:bg-gray-700">
                    Electronics
                  </Link>
                  <Link to="/category/clothing" className="block px-4 py-2 hover:bg-gray-700">
                    Clothing
                  </Link>
                  <Link to="/category/accessories" className="block px-4 py-2 hover:bg-gray-700">
                    Accessories
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about-us" className="hover:text-[#FFE31A] transition-colors">
              About Us
            </Link>
            <Link to="/contact-us" className="hover:text-[#FFE31A] transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart & Search Bar */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <Link to="/cart" className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors">
                <FaShoppingCart className="w-6 h-6" />
              </Link>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </div>
            <input type="text" placeholder="Search products..." className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE31A]" />
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="md:hidden text-[#FFE31A]">
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 mt-4 py-4">
            <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Home</Link>
            <Link to="/products" className="block px-4 py-2 hover:bg-gray-700">Products</Link>

            {/* Categories Dropdown (Mobile) */}
            <button onClick={toggleMobileDropdown} className="block px-4 py-2 hover:bg-gray-700 w-full text-left">
              Categories
              <svg className={`ml-2 w-4 h-4 inline transition-transform ${isMobileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isMobileDropdownOpen && (
              <div className="pl-6 bg-gray-700">
                <Link to="/category/electronics" className="block px-4 py-2 hover:bg-gray-600">Electronics</Link>
                <Link to="/category/clothing" className="block px-4 py-2 hover:bg-gray-600">Clothing</Link>
                <Link to="/category/accessories" className="block px-4 py-2 hover:bg-gray-600">Accessories</Link>
              </div>
            )}

            <Link to="/about-us" className="block px-4 py-2 hover:bg-gray-700">About Us</Link>
            <Link to="/contact-us" className="block px-4 py-2 hover:bg-gray-700">Contact</Link>

            {/* Search Bar (Mobile) */}
            <div className="px-4 py-2">
              <input type="text" placeholder="Search products..." className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FFE31A]" />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
