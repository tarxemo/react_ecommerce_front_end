import React from 'react';
import { FaBars, FaBell, FaUserCircle, FaShoppingCart } from 'react-icons/fa';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Left Section: Toggle Sidebar Button */}
      <button onClick={toggleSidebar} className="lg:hidden">
        <FaBars className="text-2xl" />
      </button>

      {/* Middle Section: Logo */}
      <div className="text-xl font-bold text-[#FFE31A]">
        Zanzibar Safaris Admin
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-6">
        <FaShoppingCart className="text-2xl text-gray-400 hover:text-[#FFE31A] cursor-pointer" />
        <FaBell className="text-2xl text-gray-400 hover:text-[#FFE31A] cursor-pointer" />
        <FaUserCircle className="text-2xl text-gray-400 hover:text-[#FFE31A] cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;