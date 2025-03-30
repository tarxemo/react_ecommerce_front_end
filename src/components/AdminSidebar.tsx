import React from 'react';
import { FaHome, FaBox, FaUsers, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
    >
      {/* Sidebar Header */}
      <div className="p-6 text-xl font-bold text-[#FFE31A] border-b border-gray-800">
        Admin Panel
      </div>

      {/* Sidebar Menu */}
      <nav className="p-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin"
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaHome className="text-xl" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaBox className="text-xl" />
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaUsers className="text-xl" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/analytics"
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaChartLine className="text-xl" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaCog className="text-xl" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => alert('Logged out!')}
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors w-full"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;