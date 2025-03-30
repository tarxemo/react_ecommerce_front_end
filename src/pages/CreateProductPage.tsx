import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_CATEGORIES } from '../api/queries';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    isAvailable: true, // Set as a boolean
    sku: '',
    brand: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories using GraphQL
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_ALL_CATEGORIES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
  
    // Type narrowing: Ensure we're working with an HTMLInputElement
    if (type === 'checkbox' || type === 'radio') {
      // We are now confident that checked exists on e.target
      setFormData({
        ...formData, // Use checked for checkbox or radio button
      });
    } else {
      // For other types like text or select, use value
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('stockQuantity', formData.stockQuantity);
    formDataToSend.append('isAvailable', String(formData.isAvailable)); // Convert boolean to string
    formDataToSend.append('sku', formData.sku);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('image', image); // Append the image file

    try {
      const token = localStorage.getItem('accessToken'); // Get auth token from storage
      const response = await axios.post(
        'https://tar.pythonanywhere.com/products/create/', 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in request
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Product created:', response.data);
      navigate('/products'); // Redirect to product list page
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8 text-[#FFE31A]">Create New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6 px-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                required
              >
                <option value="">Select Category</option>
                {categoriesData?.categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Updated Availability Field */}
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 text-[#FFE31A] bg-gray-800 border-gray-600 focus:ring-[#FFE31A]"
              />
              <label className="text-sm font-medium">Available</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center bg-gray-800 text-white p-2 cursor-pointer hover:bg-gray-700">
                <FaUpload className="mr-2" />
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
              </label>
              {image && <span className="text-sm text-gray-400">{image.name}</span>}
            </div>
          </div>

          <button type="submit" disabled={loading || categoriesLoading} className="px-4 py-2 bg-[#FFE31A] text-gray-900">
            {loading ? 'Creating...' : 'Create Product'}
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateProductPage;
