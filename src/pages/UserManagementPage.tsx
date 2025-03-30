import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {  GET_ALL_USERS } from '../api/queries'; // Adjust the path as needed
import {   CREATE_USER,  UPDATE_USER, DELETE_USER} from '../api/mutations'; 
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';

const UserManagementPage: React.FC = () => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    userType: 'CUSTOMER',
    phoneNumber: '',
    address: '',
    profilePicture: '',
    dateOfBirth: '',
    isVerified: false,
  });
  const [editUserId, setEditUserId] = useState<string | null>(null);

  // Fetch all users
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);

  // Create user mutation
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      alert('User created successfully!');
      refetch();
      setFormData({
        username: '',
        email: '',
        userType: 'CUSTOMER',
        phoneNumber: '',
        address: '',
        profilePicture: '',
        dateOfBirth: '',
        isVerified: false,
      });
    },
    onError: (err) => alert(`Error: ${err.message}`),
  });

  // Update user mutation
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      alert('User updated successfully!');
      refetch();
      setEditUserId(null);
      setFormData({
        username: '',
        email: '',
        userType: 'CUSTOMER',
        phoneNumber: '',
        address: '',
        profilePicture: '',
        dateOfBirth: '',
        isVerified: false,
      });
    },
    onError: (err) => alert(`Error: ${err.message}`),
  });

  // Delete user mutation
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      alert('User deleted successfully!');
      refetch();
    },
    onError: (err) => alert(`Error: ${err.message}`),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUserId) {
      updateUser({ variables: { id: editUserId, userData: formData } });
    } else {
      createUser({ variables: { userData: formData } });
    }
  };

  const handleEdit = (user: any) => {
    setEditUserId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      address: user.address,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      isVerified: user.isVerified,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser({ variables: { id } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
      <h1 className="text-2xl font-bold text-[#FFE31A] mb-6">User Management</h1>

      {/* User Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editUserId ? 'Edit User' : 'Create New User'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
            required
          />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
            required
          >
            <option value="ADMIN">Admin</option>
            <option value="CUSTOMER">Customer</option>
            <option value="SELLER">Seller</option>
          </select>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="profilePicture"
            placeholder="Profile Picture URL"
            value={formData.profilePicture}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified}
              onChange={(e) =>
                setFormData({ ...formData, isVerified: e.target.checked })
              }
              className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
            />
            <span>Verified</span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#FFE31A] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFE31A]/90 transition-colors"
        >
          {editUserId ? 'Update User' : 'Create User'}
        </button>
      </form>

      {/* User List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">User Type</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.CustomUsers.map((user: any) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.userType}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-[#FFE31A] hover:text-[#FFE31A]/90"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  );
};

export default UserManagementPage;