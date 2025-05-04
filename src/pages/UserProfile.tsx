// components/UserProfile.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_USER_PROFILE } from '../api/queries';
import { FaStar, FaUser, FaBox, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getCloudinaryUrl } from '../utils/cloudinary';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { username },
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFE31A]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Error: {error.message}</p>
    </div>
  );

  const user = data.getUserProfile;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-gray-800 rounded-lg">
          <div className="flex-shrink-0">
            {user.profilePicture ? (
              <img
                src={getCloudinaryUrl(user.profilePicture)}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-2 border-[#FFE31A]"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-2 border-[#FFE31A]">
                <FaUser className="text-5xl text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-[#FFE31A]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-400">@{user.username}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center text-sm">
                <FaCalendarAlt className="mr-2 text-[#FFE31A]" />
                <span>Joined {new Date(user.dateJoined).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <FaBox className="mr-2 text-[#FFE31A]" />
                <span>{user.totalProducts} Products</span>
              </div>
              
              {user.rating && (
                <div className="flex items-center text-sm">
                  <FaStar className="mr-1 text-[#FFE31A]" />
                  <span>{user.rating.toFixed(1)} Seller Rating</span>
                </div>
              )}
            </div>
            
            {user.userType === 'SELLER' && (
              <p className="mt-2 px-3 py-1 bg-[#FFE31A] text-gray-900 rounded-full text-sm font-medium inline-block">
                Verified Seller
              </p>
            )}
          </div>
        </div>
        
        {/* Products Section */}
        {user.totalProducts > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-[#FFE31A] border-b border-gray-700 pb-2">
              Products by {user.firstName || user.username}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {user.products.map((product: any) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-[#FFE31A]/20 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={getCloudinaryUrl(product.image)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.rating > 0 && (
                      <div className="absolute top-2 left-2 bg-gray-900/80 px-2 py-1 rounded flex items-center">
                        <FaStar className="text-[#FFE31A] mr-1" />
                        <span className="text-white text-sm">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-[#FFE31A] font-bold">${product.price}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Listed {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FaBox className="mx-auto text-4xl text-gray-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {user.firstName || user.username} hasn't listed any products yet
            </h3>
            <p className="text-gray-400">
              Check back later or browse other sellers' products
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;