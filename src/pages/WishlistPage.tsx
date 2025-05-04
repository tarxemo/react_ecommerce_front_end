import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_WISHLISTS_BY_USER } from '../api/queries';
import { DELETE_WISHLIST } from '../api/mutations';
import { useAuth } from '../utils/useAuth';
import { FaTrash, FaHeart } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCloudinaryUrl } from '../utils/cloudinary';

const WishlistPage = () => {
  const {  isAuthenticated } = useAuth();

  // Fetch wishlist items
  const { data: wishlistData, loading, error, refetch } = useQuery(GET_WISHLISTS_BY_USER, {
    skip: !isAuthenticated,
  });

  const [removeFromWishlist] = useMutation(DELETE_WISHLIST);

  const handleRemove = async (wishlistId: string) => {
    try {
      await removeFromWishlist({ variables: { id: wishlistId } });
      refetch();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Please login to view your wishlist</h2>
            <Link 
              to="/login" 
              className="inline-block px-6 py-2 bg-[#FFE31A] text-gray-900 font-medium rounded hover:bg-yellow-500 transition"
            >
              Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div>Loading...</div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div>Error: {error.message}</div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <FaHeart className="text-red-500 mr-2" /> My Wishlist
        </h1>

        {wishlistData?.wishlistsByUser?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">Your wishlist is empty</p>
            <Link 
              to="/products" 
              className="inline-block px-6 py-2 bg-[#FFE31A] text-gray-900 font-medium rounded hover:bg-yellow-500 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistData?.wishlistsByUser?.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <Link to={`/products/${item.product.id}`}>
                  <div className="h-48 overflow-hidden">
                    {item.product.image ? (
                      <img 
                        src={getCloudinaryUrl(item.product.image)}
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        <Link 
                          to={`/products/${item.product.id}`}
                          className="hover:text-[#FFE31A] transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-[#FFE31A] font-bold text-lg mb-2">
                        ${item.product.price}
                      </p>
                      <p className="text-xs text-gray-400">
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      aria-label="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="mt-4">
                    <Link 
                      to={`/products/${item.product.id}`}
                      className="block w-full text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;