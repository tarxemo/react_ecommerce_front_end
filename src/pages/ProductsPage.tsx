import  { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS_BY_SELLER } from '../api/queries';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaFilter, FaSortAmountDown, FaSearch, FaSpinner, FaUser } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCloudinaryUrl } from '../utils/cloudinary';
import queryString from 'query-string';

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const categoryId = queryParams.categoryId as string;
  const sellerId = queryParams.sellerId as string;

  // Determine which query to use based on URL parameters
  const getQueryAndVariables = () => {
    if (categoryId) {
      return {
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: { categoryId },
      };
    }
    if (sellerId) {
      return {
        query: GET_PRODUCTS_BY_SELLER,
        variables: { sellerId },
      };
    }
    return {
      query: GET_ALL_PRODUCTS,
      variables: {},
    };
  };

  const { query, variables } = getQueryAndVariables();
  const { data, loading, error } = useQuery(query, { variables });

  const [sortBy, setSortBy] = useState('name');
  const [filterPrice, setFilterPrice] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
      <FaSpinner className="animate-spin text-[#FFE31A] text-4xl" />
    </div>
  );
  if (error) return <p>Error: {error.message}</p>;

  // Get products from the appropriate query result
  const products = categoryId 
    ? data?.productsByCategory 
    : sellerId 
      ? data?.productsBySeller 
      : data?.products;

  // Filter and sort products
  const filteredProducts = products
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
      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => (
          <div 
            key={product.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#FFE31A]/10 transition-all duration-300 group"
          >
            <Link to={`/products/${product.id}`} className="block">
              <div className="relative">
                <img
                  src={getCloudinaryUrl(product.image)}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity"
                />
                {product.rating > 0 && (
                  <div className="absolute top-2 left-2 bg-gray-900/80 px-2 py-1 rounded-full flex items-center">
                    <FaStar className="text-[#FFE31A] mr-1" />
                    <span className="text-white text-sm">{product.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/products/${product.id}`} className="block">
                <h3 className="font-semibold text-lg mb-1 truncate hover:text-[#FFE31A] transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <p className="text-[#FFE31A] font-bold text-xl mb-3">${product.price}</p>
              </Link>
              
              <div className="flex items-center justify-between text-sm">
                <Link 
                  to={`/products/?categoryId=${product.category.id}`}
                  className="text-gray-400 hover:text-[#FFE31A] transition-colors"
                >
                  {product.category.name}
                </Link>
                {product.brand && (
                  <span className="text-gray-400">{product.brand}</span>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <Link 
                  to={`/user/${product.seller.username}`}
                  className="flex items-center text-sm text-gray-400 hover:text-[#FFE31A] transition-colors"
                >
                  {product.seller.profilePicture ? (
                    <img
                      src={getCloudinaryUrl(product.seller.profilePicture)}
                      alt={product.seller.username}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <FaUser className="text-xs text-gray-400" />
                    </div>
                  )}
                  <span>Sold by {product.seller.username}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

<Footer />

      
    </div>

    </div>
  );
};

export default ProductsPage;