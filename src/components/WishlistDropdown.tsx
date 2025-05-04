import { useQuery } from '@apollo/client';
import { GET_WISHLISTS_BY_USER } from '../api/queries';
import { useAuth } from '../utils/useAuth';
import {  FaRegHeart } from 'react-icons/fa';

const WishlistDropdown = () => {
  const { isAuthenticated } = useAuth();
  const { data } = useQuery(GET_WISHLISTS_BY_USER, {
    skip: !isAuthenticated,
  });

  return (
    <div className="group relative">
      <button className="p-2 relative">
        <FaRegHeart className="text-xl" />
        {data?.wishlistsByUser?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {data.wishlistsByUser.length}
          </span>
        )}
      </button>
      
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg hidden group-hover:block z-50">
        <div className="py-1">
          {!isAuthenticated ? (
            <div className="px-4 py-2 text-sm">Login to view wishlist</div>
          ) : data?.wishlistsByUser?.length === 0 ? (
            <div className="px-4 py-2 text-sm">Your wishlist is empty</div>
          ) : (
            <>
              <div className="px-4 py-2 border-b font-semibold">Your Wishlist</div>
              {data?.wishlistsByUser?.slice(0, 5).map((item: any) => (
                <a 
                  key={item.id}
                  href={`/products/${item.product.id}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {item.product.name}
                </a>
              ))}
              {data?.wishlistsByUser?.length > 5 && (
                <div className="px-4 py-2 text-sm text-center border-t">
                  +{data.wishlistsByUser.length - 5} more items
                </div>
              )}
              <div className="px-4 py-2 border-t">
                <a href="/wishlist" className="text-sm font-semibold text-blue-600">View All</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDropdown;