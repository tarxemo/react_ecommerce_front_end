import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS } from '../api/queries';
import { Link } from 'react-router-dom';
import { FaStar, FaFilter, FaSortAmountDown, FaSearch } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductsPage = () => {
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);
  const [sortBy, setSortBy] = useState('name');
  const [filterPrice, setFilterPrice] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Filter and sort products
  const filteredProducts = data.products
    .filter(
      (product: { name: string; price: number; }) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        product.price >= filterPrice.min &&
        product.price <= filterPrice.max
    )
    .sort((a: { name: string; price: number; rating: number; }, b: { name: any; price: number; rating: number; }) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div>

    <Navbar />
    
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex flex-row justify-around mb-8">
        <h1 className="text-2xl font-bold text-[#FFE31A]">Our Products</h1>
          <a
            href='/products/create'
            type="submit"
            className="px-2 bg-[#FFE31A] text-gray-900 rounded-lg py-1 hover:bg-[#FFE31A]/90 transition-colors"
          >
            Add New Product
          </a>

      </div>

      {/* Sorting, Filtering, and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-800 rounded-lg p-2 w-full md:w-64">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white focus:outline-none w-full"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-4">
          <FaSortAmountDown className="text-[#FFE31A]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="flex items-center space-x-4">
          <FaFilter className="text-[#FFE31A]" />
          <input
            type="number"
            placeholder="Min Price"
            value={filterPrice.min}
            onChange={(e) => setFilterPrice({ ...filterPrice, min: parseFloat(e.target.value) || 0 })}
            className="bg-gray-800 text-white p-2 rounded-lg focus:outline-none w-24"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filterPrice.max}
            onChange={(e) => setFilterPrice({ ...filterPrice, max: parseFloat(e.target.value) || 1000 })}
            className="bg-gray-800 text-white p-2 rounded-lg focus:outline-none w-24"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: { id: React.Key | null | undefined; image: string | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; rating: number; category: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; brand: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={`https://tar.pythonanywhere.com/media/${product.image}`}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-[#FFE31A]">{product.name}</h2>
            <p className="text-gray-400 text-sm mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-2">${product.price}</p>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">Category: {product.category.name}</p>
            <p className="text-sm text-gray-400">Brand: {product.brand}</p>
          </Link>
        ))}
      </div>

<Footer />

      
    </div>

    </div>
  );
};

export default ProductsPage;