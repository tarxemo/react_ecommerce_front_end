import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  GET_PRODUCT_DETAILS, 
  GET_CARTS_BY_USER,
  GET_WISHLISTS_BY_USER 
} from '../api/queries';
import { 
  CREATE_CART_ITEM,
  UPDATE_CART_ITEM,
  DELETE_CART_ITEM,
  CREATE_ORDER,
  CREATE_REVIEW,
  CREATE_WISHLIST,
  DELETE_WISHLIST
} from '../api/mutations';
import { FaStar, FaArrowLeft, FaShoppingCart, FaHeart, FaRegHeart, FaUser, FaBox, FaShoppingBag } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useAuth } from "../utils/useAuth";
import Footer from '../components/Footer';
import { getCloudinaryUrl } from '../utils/cloudinary';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });
  const [showCartSelection, setShowCartSelection] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);

  // Product details query
  const { data, loading, error, refetch: refetchProduct } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id: parseInt(id!) },
  });

  // User cart query
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CARTS_BY_USER, {
    skip: !isAuthenticated,
    variables: { userId: user?.id },
  });

  // User wishlist query
  const { data: wishlistData, refetch: refetchWishlist } = useQuery(GET_WISHLISTS_BY_USER, {
    skip: !isAuthenticated,
    variables: { userId: user?.id },
  });

  // Mutations
  const [addToCart] = useMutation(CREATE_CART_ITEM);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(DELETE_CART_ITEM);
  const [createOrder] = useMutation(CREATE_ORDER);
  const [addReview] = useMutation(CREATE_REVIEW);
  const [addToWishlist] = useMutation(CREATE_WISHLIST);
  const [removeFromWishlist] = useMutation(DELETE_WISHLIST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;
  const carts = cartData?.cartsByCustomuser || [];
  const wishlist = wishlistData?.wishlistsByUser || [];

  // Check if product is in any cart
  const isInCart = carts.some((cart: any) => 
    cart.items?.some(
      (item: any) => item.product.id === product.id && 
      (!selectedVariation || item.variation?.id === selectedVariation)
    )
  );

  // Check if product is in wishlist
  const isInWishlist = wishlist.some((item: any) => item.product.id === product.id);

  // Calculate final price with variation
  const calculatePrice = () => {
    if (selectedVariation) {
      const variation = product.variations.find((v: any) => v.id === selectedVariation);
      const basePrice = Number(product.price) || 0;
      const priceModifier = Number(variation?.priceModifier) || 0;
      const price = basePrice + priceModifier;
      return Number(price.toFixed(2));
    }
    return product.price;
  };

  // Cart functions
  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (carts.length === 0) {
      // If no carts exist, create one automatically
      handleAddToCart(null);
    } else if (carts.length === 1) {
      // If only one cart exists, use it directly
      handleAddToCart(carts[0].id);
    } else {
      // If multiple carts exist, show selection dialog
      setShowCartSelection(true);
    }
  };

  const handleAddToCart = async (cartId: string | null) => {
    if (!isAuthenticated) return;

    // If no cartId provided (no carts exist), create a new cart first
    let targetCartId = cartId;
    
    if (!targetCartId) {
      try {
        const { data } = await addToCart({
          variables: {
            cartItemData: {
              userId: user?.id,
              isActive: true,
              name: `Cart ${new Date().toLocaleDateString()}`
            }
          }
        });
        targetCartId = data.createCart.cart.id;
        await refetchCart();
      } catch (err) {
        alert(`Error creating cart: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return;
      }
    }

    try {
      await addToCart({
        variables: {
          cartItemData: {
            cartId: targetCartId,
            productId: product.id,
            variationId: selectedVariation,
            quantity,
            price: calculatePrice()
          }
        }
      });
      refetchCart();
      setShowCartSelection(false);
      alert('Added to cart successfully!');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to add to cart'}`);
    }
  };

  const handleRemoveFromCart = async () => {
    // Find the cart item in any cart
    let cartItemToRemove = null;
    
    for (const cart of carts) {
      const item = cart.items.find(
        (item: any) => item.product.id === product.id && 
        (!selectedVariation || item.variation?.id === selectedVariation)
      );
      if (item) {
        cartItemToRemove = item;
        break;
      }
    }
  
    if (cartItemToRemove) {
      try {
        await removeFromCart({
          variables: { id: cartItemToRemove.id }
        });
        refetchCart();
        alert('Removed from cart successfully!');
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'Failed to remove from cart'}`);
      }
    }
  };


  // Review functions
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addReview({
        variables: {
          reviewData: {
            productId: product.id,
            userId: user?.id,
            rating: review.rating,
            comment: review.comment
          }
        }
      });
      refetchProduct();
      setReview({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to submit review'}`);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  
    try {
      if (isInWishlist) {
        const wishlistItem = wishlist.find((item: any) => item.product.id === product.id);
        const { data } = await removeFromWishlist({
          variables: { id: wishlistItem.id }
        });
        if (data?.deleteWishlist?.myWishlist !== undefined) {
          localStorage.setItem('wishlist', data.deleteWishlist.myWishlist.toString());
        }
  
      } else {
        const { data } = await addToWishlist({
          variables: {
            wishlistData: {
              productId: product.id
            }
          }
        });
        if (data?.createWishlist?.myWishlist !== undefined) {
          localStorage.setItem('wishlist', data.createWishlist.myWishlist.toString());
        }
      }
  
      refetchWishlist();
      refetchProduct();
  
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to update wishlist'}`);
    }
  };
  

// Order functions
const handleBuyNow = async () => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  try {
    const { data } = await createOrder({
      variables: {
        orderData: {
          items: [{
            productId: product.id,
            variationId: selectedVariation,
            quantity,
            price: calculatePrice()
          }],
          totalAmount: calculatePrice() * quantity,
          shippingAddress: user?.address || ''
        }
      }
    });
    navigate(`/checkout/${data.createOrder.order.id}`);
  } catch (err) {
    alert(`Error: ${err instanceof Error ? err.message : 'Failed to create order'}`);
  }
};

  const handleUpdateCartItem = async (newQuantity: number) => {
    // Find the cart item in any cart
    let cartItemToUpdate = null;
    
    for (const cart of carts) {
      const item = cart.items.find(
        (item: any) => item.product.id === product.id && 
        (!selectedVariation || item.variation?.id === selectedVariation)
      );
      if (item) {
        cartItemToUpdate = item;
        break;
      }
    }

    if (cartItemToUpdate) {
      try {
        await updateCartItem({
          variables: {
            id: cartItemToUpdate.id,
            cartItemData: {
              quantity: newQuantity
            }
          }
        });
        refetchCart();
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'Failed to update cart'}`);
      }
    }
  };

  // Rest of the component remains the same...

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        {/* Back Button */}
        <Link
          to="/products"
          className="flex items-center text-[#FFE31A] hover:text-[#FFE31A]/90 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="relative">
            {/* Product Image with Floating Wishlist Button */}
            <img
              src={getCloudinaryUrl(product.image)}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            
            {/* Floating Engagement Metrics */}
            <div className="absolute top-4 right-4 flex flex-col items-center space-y-2">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="p-3 bg-gray-900/80 rounded-full backdrop-blur-sm hover:bg-[#FFE31A]/20 transition-all"
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-white text-xl hover:text-red-500 transition-colors" />
                )}
              </button>
              
              {/* Engagement Metrics */}
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center bg-gray-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                  <FaHeart className="text-red-500 mr-1" />
                  <span className="text-white text-sm">{product.wishlistCount || 0}</span>
                </div>
                
                <div className="flex items-center bg-gray-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                  <FaShoppingBag className="text-[#FFE31A] mr-1" />
                  <span className="text-white text-sm">{product.orderCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

            {/* Seller Information */}
            <div className="mb-8 mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-[#FFE31A]/50 transition-colors duration-300">
              <h2 className="text-xl font-semibold text-[#FFE31A] mb-3 flex items-center">
                <FaUser className="mr-2" /> Seller Information
              </h2>
              
              <div className="flex items-start space-x-4">
                {product.seller.profilePicture ? (
                  <Link to={`/user/${product.seller.username}`} className="flex-shrink-0">
                    <img
                      src={getCloudinaryUrl(product.seller.profilePicture)}
                      alt={product.seller.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FFE31A] hover:border-[#FFE31A]/80 transition-colors"
                    />
                  </Link>
                ) : (
                  <Link to={`/user/${product.seller.username}`} className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-[#FFE31A] hover:border-[#FFE31A]/80 transition-colors">
                      <FaUser className="text-gray-400" />
                    </div>
                  </Link>
                )}
                
                <div>
                  <Link 
                    to={`/user/${product.seller.username}`}
                    className="text-lg font-medium text-white hover:text-[#FFE31A] transition-colors inline-flex items-center"
                  >
                    {product.seller.username}
                    {product.seller.userType === 'SELLER' && (
                      <span className="ml-2 px-2 py-0.5 bg-[#FFE31A]/20 text-[#FFE31A] text-xs rounded-full">
                        Verified Seller
                      </span>
                    )}
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                    <Link 
                      to={`/products/?sellerId=${product.seller.id}`}
                      className="flex items-center text-[#FFE31A] hover:underline"
                    >
                      <FaBox className="mr-1" />
                      View all products
                    </Link>
                    
                    {product.seller.rating && (
                      <div className="flex items-center text-gray-400">
                        <FaStar className="mr-1 text-[#FFE31A]" />
                        <span>Seller Rating: {product.seller.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <Link 
                      to={`/user/${product.seller.username}`}
                      className="inline-flex items-center px-3 py-1 bg-gray-700 hover:bg-[#FFE31A] hover:text-gray-900 text-white rounded-full text-sm transition-colors duration-300"
                    >
                      <FaUser className="mr-1" />
                      Visit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold text-[#FFE31A] mb-2">Reviews</h2>
                            
              {/* Add Review Form */}
              {isAuthenticated && (
                <div className="bg-gray-800 p-2 lg:p-6 rounded-lg mb-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-[#FFE31A]">Write a Review</h3>
                  <div className="flex items-center mb-4">
                    {user.profilePicture ? (
                      <img
                        src={getCloudinaryUrl(user.profilePicture)}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-3 object-cover border border-[#FFE31A]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 border border-[#FFE31A]">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Link 
                        to={`/user/${user.username}`}
                        className="font-medium hover:text-[#FFE31A] transition-colors"
                      >
                        {user.username}
                      </Link>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            onClick={() => setReview({...review, rating: index + 1})}
                            className={`w-6 h-6 cursor-pointer transition-colors ${
                              index < review.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({...review, comment: e.target.value})}
                    placeholder="Share your detailed experience with this product..."
                    className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                    rows={4}
                  />
                  <button
                    onClick={handleSubmitReview}
                    className="py-2 px-6 bg-[#FFE31A] text-gray-900 font-medium rounded-lg hover:bg-[#FFE31A]/90 transition-colors flex items-center"
                  >
                    <FaStar className="mr-2" />
                    Submit Review
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-[#FFE31A]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      {review.user.profilePicture ? (
                        <Link to={`/user/${review.user.username}`} className="flex-shrink-0">
                          <img
                            src={getCloudinaryUrl(review.user.profilePicture)}
                            alt={review.user.username}
                            className="w-12 h-12 rounded-full object-cover border border-[#FFE31A]"
                          />
                        </Link>
                      ) : (
                        <Link to={`/user/${review.user.username}`} className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border border-[#FFE31A]">
                            <FaUser className="text-gray-400" />
                          </div>
                        </Link>
                      )}
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link 
                              to={`/user/${review.user.username}`}
                              className="font-medium hover:text-[#FFE31A] transition-colors"
                            >
                              {review.user.username}
                            </Link>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, index) => (
                                <FaStar
                                  key={index}
                                  className={`w-4 h-4 ${
                                    index < review.rating ? 'text-yellow-400' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-400">
                                {review.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="mt-3 text-gray-300 whitespace-pre-line">{review.comment}</p>
                        
                        {review.user.userType === 'SELLER' && (
                          <div className="mt-3">
                            <Link 
                              to={`/products/?sellerId=${review.user.id}`}
                              className="inline-flex items-center text-sm text-[#FFE31A] hover:underline"
                            >
                              <FaBox className="mr-1" />
                              View all products by this seller
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Product Information */}
          <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg">

            <h1 className="text-3xl font-bold text-[#FFE31A] mb-4">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            <p className="text-2xl font-bold mb-4">${calculatePrice()}</p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-400">({product.reviews.length} reviews)</span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-600"
                >
                  -
                </button>
                <span className="bg-gray-700 px-4 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Variations */}
            {product.variations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#FFE31A] mb-2">Options</h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.variations.map((variation: any) => (
                    <div className='flex flex-col'>
                      <h3>{variation.variationType}</h3>
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariation(variation.id)}
                      className={`p-2 rounded-lg ${
                        selectedVariation === variation.id
                          ? 'bg-[#FFE31A] text-gray-900'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {variation.variationValue} <span className='mx-2'>(+${variation.priceModifier})</span>
                    </button>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 mb-6">
              {isInCart ? (
                <>
                  <button
                    onClick={handleRemoveFromCart}
                    className="w-full py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove from Cart
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateCartItem(quantity)}
                      className="flex-1 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 transition-colors"
                    >
                      Update Quantity
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Checkout Now
                    </button>
                  </div>
                </>
              ) : (
                <div className='flex flex-row'>
                  <button
                    onClick={handleAddToCartClick}
                    className="py-2 m-2 w-1/2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 transition-colors flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-1/2 m-2 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>

          {/* Product Details */}
          <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#FFE31A] mb-2">Details</h2>
              <p className="text-sm text-gray-400 mb-2">
                {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
              <p className="text-sm text-gray-400 mb-2">SKU: {product.sku}</p>
              <p className="text-sm text-gray-400 mb-2">Category: {product.category.name}</p>
              <p className="text-sm text-gray-400">Brand: {product.brand}</p>
            </div>
          </div>          
        </div>

        {/* Cart Selection Dialog */}
        {showCartSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Select a Cart</h3>
              <div className="space-y-3 mb-4">
                {carts.map((cart: any) => (
                  <div 
                    key={cart.id}
                    onClick={() => setSelectedCartId(cart.id)}
                    className={`p-3 rounded-lg cursor-pointer ${selectedCartId === cart.id ? 'bg-[#FFE31A] text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{cart.name || `Cart ${cart.id.slice(0, 8)}`}</span>
                      <span className="text-sm">{cart.items?.length || 0} items</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCartSelection(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddToCart(selectedCartId || carts[0]?.id)}
                  className="px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90"
                  disabled={!selectedCartId && carts.length === 0}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default ProductDetailsPage;


 