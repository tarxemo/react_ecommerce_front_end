import React, { useState } from 'react';
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
import { FaStar, FaArrowLeft, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useAuth } from "../utils/useAuth";
import Footer from '../components/Footer';

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
  const cart = cartData?.carts_by_user[0] || null;
  const wishlist = wishlistData?.wishlists_by_user || [];

  // Check if product is in cart
  const isInCart = cart?.items.some(
    (item: any) => item.product.id === product.id && 
    (!selectedVariation || item.variation?.id === selectedVariation)
  );

  // Check if product is in wishlist
  const isInWishlist = wishlist.some((item: any) => item.product.id === product.id);

  // Calculate final price with variation
  const calculatePrice = () => {
    if (selectedVariation) {
      const variation = product.variations.find((v: any) => v.id === selectedVariation);
      
      // Ensure both values are numbers before adding
      const basePrice = Number(product.price) || 0;
      const priceModifier = Number(variation?.priceModifier) || 0;
    
      const price = basePrice + priceModifier;
      
      return Number(price.toFixed(2)); // Ensure it returns a decimal number
    }
    return product.price;
  };

  // Cart functions
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart({
        variables: {
          cartItemData: {
            cartId: cart?.id,
            productId: product.id,
            variationId: selectedVariation,
            quantity,
            price: calculatePrice()
          }
        }
      });
      refetchCart();
      alert('Added to cart successfully!');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to add to cart'}`);
    }
  };

  const handleRemoveFromCart = async () => {
    const cartItem = cart?.items.find(
      (item: any) => item.product.id === product.id && 
      (!selectedVariation || item.variation?.id === selectedVariation)
    );

    if (cartItem) {
      try {
        await removeFromCart({
          variables: { id: cartItem.id }
        });
        refetchCart();
        alert('Removed from cart successfully!');
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'Failed to remove from cart'}`);
      }
    }
  };

  const handleUpdateCartItem = async (newQuantity: number) => {
    const cartItem = cart?.items.find(
      (item: any) => item.product.id === product.id && 
      (!selectedVariation || item.variation?.id === selectedVariation)
    );

    if (cartItem) {
      try {
        await updateCartItem({
          variables: {
            id: cartItem.id,
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

  // Wishlist functions
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        const wishlistItem = wishlist.find((item: any) => item.product.id === product.id);
        await removeFromWishlist({
          variables: { id: wishlistItem.id }
        });
        alert('Removed from wishlist!');
      } else {
        await addToWishlist({
          variables: {
            wishlistData: {
              userId: user?.id,
              productId: product.id
            }
          }
        });
        alert('Added to wishlist!');
      }
      refetchWishlist();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to update wishlist'}`);
    }
  };

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
            <img
              src={`http://127.0.0.1:8000/media/${product.image}`}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="mt-4 flex items-center justify-center w-full py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {isInWishlist ? (
                <>
                  <FaHeart className="text-red-500 mr-2" />
                  Remove from Wishlist
                </>
              ) : (
                <>
                  <FaRegHeart className="mr-2" />
                  Add to Wishlist
                </>
              )}
            </button>
          </div>

          {/* Product Information */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariation(variation.id)}
                      className={`p-2 rounded-lg ${
                        selectedVariation === variation.id
                          ? 'bg-[#FFE31A] text-gray-900'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {variation.variationValue} (+${variation.priceModifier})
                    </button>
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
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 transition-colors flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </>
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

            {/* Seller Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#FFE31A] mb-2">Sold By</h2>
              <p className="text-gray-400">{product.seller.username}</p>
              <p className="text-gray-400">{product.seller.email}</p>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold text-[#FFE31A] mb-2">Reviews</h2>
              
              {/* Add Review Form */}
              {isAuthenticated && (
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="text-lg mb-2">Write a Review</h3>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        onClick={() => setReview({...review, rating: index + 1})}
                        className={`w-6 h-6 cursor-pointer ${
                          index < review.rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({...review, comment: e.target.value})}
                    placeholder="Share your thoughts about this product..."
                    className="w-full bg-gray-800 text-white p-2 rounded-lg mb-2"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitReview}
                    className="py-1 px-4 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90"
                  >
                    Submit Review
                  </button>
                </div>
              )}

              {/* Reviews List */}
              {product.reviews.map((review: any) => (
                <div key={review.id} className="bg-gray-700 p-4 rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{review.user.username}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`w-4 h-4 ${
                              index < review.rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetailsPage;