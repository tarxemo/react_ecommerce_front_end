import { useMutation } from '@apollo/client';
import { CREATE_WISHLIST, DELETE_WISHLIST } from '../api/mutations';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../utils/useAuth';

const WishlistButton = ({ productId, isInWishlist, refetch }: { 
  productId: string;
  isInWishlist: boolean;
  refetch: () => void;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [addToWishlist] = useMutation(CREATE_WISHLIST);
  const [removeFromWishlist] = useMutation(DELETE_WISHLIST);

  const handleClick = async () => {
    if (!isAuthenticated) return;

    try {
      if (isInWishlist) {
        await removeFromWishlist({ 
          variables: { 
            id: 1,
          } 
        });
      } else {
        await addToWishlist({
          variables: {
            wishlistData: {
              userId: user?.id,
              productId
            }
          }
        });
      }
      refetch();
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`p-2 rounded-full ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default WishlistButton;