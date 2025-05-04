import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CART_BY_ID, GET_CART_ITEMS_BY_CART } from '../api/queries';
import { CREATE_ORDER } from '../api/mutations';
import { useAuth } from '../utils/useAuth';
import { FaShoppingCart, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartId } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit_card',
    transactionId: ''
  });

  // Fetch cart data
  const { data: cartData, loading: cartLoading } = useQuery(GET_CART_BY_ID, {
    variables: { id: cartId },
    skip: !cartId
  });

  // Fetch cart items
  const { data: cartItemsData, loading: itemsLoading } = useQuery(GET_CART_ITEMS_BY_CART, {
    variables: { cartId },
    skip: !cartId
  });

  // Order placement mutation
  const [createOrder, { loading: isPlacingOrder }] = useMutation(CREATE_ORDER);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#FFE31A] mb-4">Please log in to checkout</h2>
          <Link 
            to="/login" 
            className="px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading || itemsLoading) return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
      <FaSpinner className="animate-spin text-[#FFE31A] text-4xl" />
    </div>
  );

  const cart = cartData?.cart;
  const cartItems = cartItemsData?.cartItemsByCart || [];

  const calculateTotal = () => {
    return cartItems.reduce(
      (total: number, item: any) => total + (item.price * item.quantity), 
      0
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!cartId) return;

    // Basic validation
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      alert('Please fill in all required shipping information');
      return;
    }

    if (!formData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const { data } = await createOrder({
        variables: {
          orderData: {
            totalAmount: calculateTotal().toString(),
            items: cartItems.map((item: any) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.price.toString(),
              variationId: item.variation?.id || null
            })),
            paymentMethod: formData.paymentMethod,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
            status: 'pending',
            transactionId: formData.transactionId || `TXN-${Date.now()}`
          }
        }
      });

      if (data?.createOrder?.order) {
        navigate(`/order-confirmation/${data.createOrder.order.id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-[#FFE31A] mb-8">Checkout</h1>
        
        {!cart ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FaShoppingCart className="text-5xl text-[#FFE31A] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Cart Selected</h2>
            <p className="text-gray-400 mb-4">Please select a cart to proceed with checkout</p>
            <Link 
              to="/cart" 
              className="px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90"
            >
              Back to Carts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Progress */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFE31A] text-gray-900 flex items-center justify-center mb-2">
                    1
                  </div>
                  <span className="text-xs">Cart</span>
                </div>
                <div className="h-1 flex-1 bg-[#FFE31A] mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFE31A] text-gray-900 flex items-center justify-center mb-2">
                    2
                  </div>
                  <span className="text-xs">Details</span>
                </div>
                <div className="h-1 flex-1 bg-[#FFE31A] mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                    3
                  </div>
                  <span className="text-xs">Payment</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between border-b border-gray-700 pb-4">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      {item.variation && (
                        <p className="text-sm text-gray-400">
                          {item.variation.variationType}: {item.variation.variationValue}
                        </p>
                      )}
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2" 
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2" 
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Address *</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2" 
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">City *</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2" 
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Postal Code *</label>
                  <input 
                    type="text" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2" 
                    placeholder="Enter postal code"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleInputChange}
                    className="form-radio text-[#FFE31A]" 
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="form-radio text-[#FFE31A]" 
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleInputChange}
                    className="form-radio text-[#FFE31A]" 
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>

              {formData.paymentMethod === 'credit_card' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Card Number</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 rounded px-3 py-2" 
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Expiration Date</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 rounded px-3 py-2" 
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">CVV</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 rounded px-3 py-2" 
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Name on Card</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 rounded px-3 py-2" 
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="mt-4">
                  <label className="block text-sm mb-1">Transaction ID (Optional)</label>
                  <input 
                    type="text" 
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2" 
                    placeholder="Enter bank transaction ID"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    If you've already made the transfer, please provide the transaction ID for reference.
                  </p>
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full py-3 bg-[#FFE31A] text-gray-900 rounded-lg font-bold text-lg hover:bg-[#FFE31A]/90 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPlacingOrder ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Place Order
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;