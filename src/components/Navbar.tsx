import { useState, useEffect, useRef } from "react";
import { 
  FaBars, 
  FaTimes, 
  FaShoppingCart, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram,
  FaUser,
  FaHeart,
  FaBox,
  FaSignOutAlt,
  FaSpinner,
  FaSearch,
  FaHome,
  FaShoppingBag,
  FaList,
  FaUserPlus
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import { getCart, getWishlist } from "../utils/auth";
import { getCloudinaryUrl } from "../utils/cloudinary";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../api/queries";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_ALL_CATEGORIES);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other dropdowns when mobile menu toggles
    if (!isMobileMenuOpen) {
      setIsMobileDropdownOpen(false);
      setIsProfileDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const mobileMenuVariants = {
    open: { 
      opacity: 1,
      height: "auto",
      transition: { 
        type: "spring",
        bounce: 0,
        duration: 0.7,
        delayChildren: 0.3,
        staggerChildren: 0.05
      }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        type: "spring",
        bounce: 0,
        duration: 0.3
      }
    }
  };

  const mobileItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  return (
    <>
      {/* Top Bar: Social Media & Contact */}
      <div className={`bg-gray-800 text-white py-2 transition-all duration-300 ${isSticky ? "opacity-0" : "opacity-100"}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors" />
            </a>
          </div>

          <div className="text-sm flex flex-row">
            <span className="hidden md:flex md:flex-row mr-4">Email: code@tarxemo.com</span>
            <span>Phone: +255 742106833</span>
          </div>
        </div>
      </div>
      
      {/* Navbar */}
      <nav className={`bg-gray-900 text-white py-4 sticky top-0 z-50 transition-all duration-300 ${isSticky ? "shadow-lg" : ""}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo.jpeg" alt="EcommerceApp Logo" className="h-10 w-auto" />
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
              <button 
                onClick={toggleDropdown} 
                className="hover:text-[#FFE31A] transition-colors flex items-center"
                aria-expanded={isDropdownOpen}
                aria-controls="desktop-categories-dropdown"
              >
                Categories
                <svg className={`ml-2 w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div 
                  id="desktop-categories-dropdown"
                  className="absolute top-full left-0 bg-gray-800 text-white py-2 mt-2 rounded-lg shadow-lg w-48 max-h-96 overflow-y-auto z-50"
                >
                  {categoriesLoading ? (
                    <div className="flex justify-center p-2">
                      <FaSpinner className="animate-spin text-[#FFE31A]" />
                    </div>
                  ) : (
                    categoriesData?.categories?.map((category: { id: string; name: string }) => (
                      <Link 
                        key={category.id}
                        to={`/products/?categoryId=${category.id}`}
                        className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Search, Cart & Profile */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE31A] w-64"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FFE31A]"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/wishlist" 
                  className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative"
                  aria-label="Wishlist"
                >
                  <FaHeart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlist()}
                  </span>
                </Link>
                <Link 
                  to="/cart" 
                  className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative"
                  aria-label="Cart"
                >
                  <FaShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCart()}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/wishlist" 
                  className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative"
                  aria-label="Wishlist"
                >
                  <FaHeart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                <Link 
                  to="/cart" 
                  className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative"
                  aria-label="Cart"
                >
                  <FaShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-expanded={isProfileDropdownOpen}
                  aria-controls="profile-dropdown"
                >
                  {user?.profilePicture ? (
                    <img
                      src={getCloudinaryUrl(user.profilePicture)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFE31A] flex items-center justify-center">
                      {user?.username?.charAt(0).toUpperCase() || <FaUser className="text-gray-900" />}
                    </div>
                  )}
                </button>
                
                {isProfileDropdownOpen && (
                  <div 
                    id="profile-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-[#FFE31A]">{user?.username}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      <FaHeart className="mr-2" /> Wishlist
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      <FaBox className="mr-2" /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="px-3 py-1 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-1 border border-[#FFE31A] text-[#FFE31A] rounded-lg hover:bg-[#FFE31A] hover:text-gray-900 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden text-[#FFE31A] flex items-center"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <>
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/wishlist" 
                      className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative mr-4"
                      aria-label="Wishlist"
                    >
                      <FaHeart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getWishlist()}
                      </span>
                    </Link>
                    <Link 
                      to="/cart" 
                      className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative mr-4"
                      aria-label="Cart"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getCart()}
                      </span>
                    </Link>
                  </>
                )}
                <FaBars className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden bg-gray-800 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-2">
                {/* Search Bar (Mobile) */}
                <motion.form 
                  onSubmit={handleSearch}
                  variants={mobileItemVariants}
                  className="mb-4 relative"
                >
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FFE31A] pl-10"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </motion.form>

                {/* Main Mobile Menu Items */}
                <motion.div variants={mobileItemVariants}>
                  <Link 
                    to="/" 
                    className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaHome className="mr-3 text-[#FFE31A]" /> Home
                  </Link>
                </motion.div>

                <motion.div variants={mobileItemVariants}>
                  <Link 
                    to="/products" 
                    className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaShoppingBag className="mr-3 text-[#FFE31A]" /> Products
                  </Link>
                </motion.div>

                {/* Categories Dropdown (Mobile) */}
                <motion.div variants={mobileItemVariants}>
                  <button 
                    onClick={toggleMobileDropdown}
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                    aria-expanded={isMobileDropdownOpen}
                  >
                    <div className="flex items-center">
                      <FaList className="mr-3 text-[#FFE31A]" /> Categories
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isMobileDropdownOpen ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {isMobileDropdownOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-8 overflow-hidden"
                      >
                        {categoriesLoading ? (
                          <div className="flex justify-center p-2">
                            <FaSpinner className="animate-spin text-[#FFE31A]" />
                          </div>
                        ) : (
                          categoriesData?.categories?.map((category: { id: string; name: string }) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link 
                                to={`/products/?categoryId=${category.id}`}
                                className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
                                onClick={() => {
                                  setIsMobileDropdownOpen(false);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                {category.name}
                              </Link>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Mobile Auth Links */}
                {isAuthenticated ? (
                  <>
                    <motion.div variants={mobileItemVariants}>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUser className="mr-3 text-[#FFE31A]" /> Profile
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={mobileItemVariants}>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaHeart className="mr-3 text-[#FFE31A]" /> Wishlist
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={mobileItemVariants}>
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaBox className="mr-3 text-[#FFE31A]" /> My Orders
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={mobileItemVariants}>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                      >
                        <FaSignOutAlt className="mr-3 text-[#FFE31A]" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={mobileItemVariants}>
                      <Link 
                        to="/login" 
                        className="flex items-center px-4 py-3 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 transition-colors mb-1 justify-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUser className="mr-3" /> Login
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={mobileItemVariants}>
                      <Link 
                        to="/register" 
                        className="flex items-center px-4 py-3 border border-[#FFE31A] text-[#FFE31A] rounded-lg hover:bg-[#FFE31A] hover:text-gray-900 transition-colors mb-1 justify-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUserPlus className="mr-3" /> Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;