import  { useState, useEffect } from "react";
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
  FaHistory,
  FaCog
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth"; // Import your auth hook

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
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

          {/* Cart, Search & Profile */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE31A]" 
            />
            
            {/* Wishlist */}
            <Link to="/wishlist" className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative">
              <FaHeart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">5</span>
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="text-[#FFE31A] hover:text-[#FFE31A]/80 transition-colors relative">
              <FaShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </Link>
            
            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFE31A] flex items-center justify-center">
                    {user?.username?.charAt(0).toUpperCase() || <FaUser className="text-gray-900" />}
                  </div>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-[#FFE31A]">{user?.username}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      <FaHeart className="mr-2" /> Wishlist
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      <FaBox className="mr-2" /> My Orders
                    </Link>
                    <Link 
                      to="/order-history" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      <FaHistory className="mr-2" /> Order History
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      <FaCog className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-700"
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

            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link>
                <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-700">Wishlist</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-700">My Orders</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-700">Login</Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-700">Register</Link>
              </>
            )}

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