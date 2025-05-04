import { useQuery } from '@apollo/client';
import { GET_ORDER_BY_ID } from '../api/queries';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck, FaHome } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  
  const { data, loading, error } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId }
  });

  if (loading) return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFE31A]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <p className="text-red-500">Error loading order: {error.message}</p>
    </div>
  );

  const order = data?.order;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <FaCheckCircle className="text-5xl text-[#FFE31A] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-300 mb-6">
            Thank you for your purchase. Your order #{order?.id.slice(0, 8)} has been received.
          </p>

          <div className="bg-gray-700 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-[#FFE31A]">Order Information</h3>
                <p>Order #: {order?.id.slice(0, 8)}</p>
                <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                <p>Status: <span className="capitalize">{order?.status.toLowerCase()}</span></p>
                <p>Total: ${order?.totalAmount}</p>
              </div>
              <div>
                <h3 className="font-medium text-[#FFE31A]">Shipping Information</h3>
                <p>{order?.shippingAddress}</p>
                <p>Payment Method: {order?.paymentMethod}</p>
                {order?.transactionId && <p>Transaction ID: {order?.transactionId}</p>}
              </div>
            </div>
          </div>

          {/* Order Progress */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFE31A] text-gray-900 flex items-center justify-center mb-2">
                  <FaBox size={24} />
                </div>
                <h3 className="font-medium">Order Processed</h3>
                <p className="text-sm text-gray-400">We've received your order</p>
              </div>
              <div className="h-1 w-16 bg-[#FFE31A] hidden md:block"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                  <FaTruck size={24} />
                </div>
                <h3 className="font-medium">Order Shipped</h3>
                <p className="text-sm text-gray-400">Your items are on the way</p>
              </div>
              <div className="h-1 w-16 bg-gray-700 hidden md:block"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                  <FaHome size={24} />
                </div>
                <h3 className="font-medium">Order Delivered</h3>
                <p className="text-sm text-gray-400">Your items have arrived</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/orders" 
              className="px-6 py-3 bg-[#FFE31A] text-gray-900 rounded-lg font-medium hover:bg-[#FFE31A]/90"
            >
              View Your Orders
            </Link>
            <Link 
              to="/" 
              className="px-6 py-3 bg-gray-700 rounded-lg font-medium hover:bg-gray-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;