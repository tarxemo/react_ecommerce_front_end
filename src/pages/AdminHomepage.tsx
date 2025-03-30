import React, { useState } from 'react';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';

const AdminHomepage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-[#FFE31A] mb-4">Welcome to the Admin Dashboard</h1>
          <p className="text-gray-400">
            Manage your e-commerce platform efficiently. View analytics, manage products, and handle
            user accounts with ease.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-[#FFE31A] to-[#FFA41A] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900">Total Products</h2>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-gradient-to-br from-[#00C9FF] to-[#92FE9D] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900">Total Users</h2>
              <p className="text-3xl font-bold text-gray-900">5,678</p>
            </div>
            <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FFE66D] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900">Total Orders</h2>
              <p className="text-3xl font-bold text-gray-900">9,876</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHomepage;