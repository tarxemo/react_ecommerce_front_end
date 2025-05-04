import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_CATEGORIES } from '../api/queries';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaPlus, FaMinus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { ENDPOINT } from '../api/environment';

interface Variation {
  variation_type: string;
  variation_value: string;
  price_modifier: string;
  stock_quantity: string;
}

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '0', // Will be calculated from variations
    isAvailable: true,
    sku: '',
    brand: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [variations, setVariations] = useState<Variation[]>([
    {
      variation_type: '',
      variation_value: '',
      price_modifier: '0.00',
      stock_quantity: '0',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories using GraphQL
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_ALL_CATEGORIES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVariationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVariations = [...variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [name]: value,
    };
    setVariations(updatedVariations);
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        variation_type: '',
        variation_value: '',
        price_modifier: '0.00',
        stock_quantity: '0',
      },
    ]);
  };

  const removeVariation = (index: number) => {
    if (variations.length <= 1) {
      alert('You must have at least one variation');
      return;
    }
    const updatedVariations = [...variations];
    updatedVariations.splice(index, 1);
    setVariations(updatedVariations);
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

    // Validate variations
    for (const variation of variations) {
      if (!variation.variation_type || !variation.variation_value) {
        setError('Please fill in all variation fields');
        return;
      }
    }

    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('stockQuantity', '0'); // Will be calculated from variations
    formDataToSend.append('isAvailable', String(formData.isAvailable));
    formDataToSend.append('sku', formData.sku);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('image', image);
    formDataToSend.append('variations', JSON.stringify(variations));


    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${ENDPOINT}/products/create/`, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Product created:', response.data);
      navigate('/products');
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
              <label className="block text-sm font-medium mb-2">Base Price</label>
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

            <div className="flex-1 flex items-center space-x-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
                className="w-5 h-5 text-[#FFE31A] bg-gray-800 border-gray-600 focus:ring-[#FFE31A]"
              />
              <label className="text-sm font-medium">Available</label>
            </div>
          </div>

          {/* Product Variations Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#FFE31A]">Product Variations</h2>
              <button
                type="button"
                onClick={addVariation}
                className="flex items-center px-3 py-1 bg-[#FFE31A] text-gray-900 rounded"
              >
                <FaPlus className="mr-1" /> Add Variation
              </button>
            </div>

            {variations.map((variation, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Variation #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <FaMinus />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type (e.g., Size, Color)</label>
                    <input
                      type="text"
                      name="variation_type"
                      value={variation.variation_type}
                      onChange={(e) => handleVariationChange(index, e)}
                      className="w-full bg-gray-700 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Value (e.g., Large, Red)</label>
                    <input
                      type="text"
                      name="variation_value"
                      value={variation.variation_value}
                      onChange={(e) => handleVariationChange(index, e)}
                      className="w-full bg-gray-700 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Modifier</label>
                    <input
                      type="number"
                      name="price_modifier"
                      value={variation.price_modifier}
                      onChange={(e) => handleVariationChange(index, e)}
                      className="w-full bg-gray-700 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={variation.stock_quantity}
                      onChange={(e) => handleVariationChange(index, e)}
                      className="w-full bg-gray-700 text-white p-2 focus:ring-2 focus:ring-[#FFE31A]"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
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

          <button 
            type="submit" 
            disabled={loading || categoriesLoading} 
            className="px-4 py-2 bg-[#FFE31A] text-gray-900 font-medium rounded hover:bg-yellow-500 transition"
          >
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