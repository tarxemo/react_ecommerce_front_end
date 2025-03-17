import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PRODUCT } from '../api/mutations';
import { GET_ALL_CATEGORIES } from '../api/queries';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stockQuantity: 0,
    isAvailable: true,
    sku: '',
    brand: '',
  });
  const [image, setImage] = useState<File | null>(null);

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_ALL_CATEGORIES);

  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      navigate('/products'); // Redirect to products page after creation
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    await createProduct({
      variables: {
        productData: formData,
        image,
      },
    });
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8 text-[#FFE31A]">Create New Product</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-4">
          {/* Row 1: Name and SKU */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
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
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
              rows={4}
              required
            />
          </div>

          {/* Row 3: Price, Stock Quantity, and Brand */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
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
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
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
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
          </div>

          {/* Row 4: Category and Availability */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              >
                <option value="">Select Category</option>
                {categoriesData?.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Availability</label>
              <select
                name="isAvailable"
                value={formData.isAvailable.toString()}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                className="w-full bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              >
                <option value="true">Available</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Row 5: Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center bg-gray-800 text-white p-2 cursor-pointer hover:bg-gray-700">
                <FaUpload className="mr-2" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
              {image && <span className="text-sm text-gray-400">{image.name}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || categoriesLoading}
              className="px-2 bg-[#FFE31A] text-gray-900 py-2 hover:bg-[#FFE31A]/90 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>

          {/* Error Messages */}
          {error && <p className="text-red-500 text-center">{error.message}</p>}
          {categoriesError && <p className="text-red-500 text-center">Failed to load categories: {categoriesError.message}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateProductPage;