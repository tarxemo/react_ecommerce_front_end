import  { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORDERS_BY_USER, GET_ORDER_ITEMS_BY_ORDER } from '../api/queries';
import { UPDATE_ORDER, DELETE_ORDER } from '../api/mutations';
import { useAuth } from '../utils/useAuth';
import { FaBox, FaCheck, FaTimes, FaTrash, FaEdit, FaSpinner, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Fetch user's orders
  const { data: ordersData, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery(GET_ORDERS_BY_USER);

  // Fetch order items when an order is selected
  const { data: orderItemsData, loading: itemsLoading } = useQuery(GET_ORDER_ITEMS_BY_ORDER, {
    variables: { orderId: selectedOrder },
    skip: !selectedOrder
  });

  // Mutations
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#FFE31A] mb-4">Please log in to view your orders</h2>
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

  if (ordersLoading) return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
      <FaSpinner className="animate-spin text-[#FFE31A] text-4xl" />
    </div>
  );

  if (ordersError) return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <p className="text-red-500">Error loading orders: {ordersError.message}</p>
    </div>
  );

  const orders = ordersData?.ordersByUser || [];

  // Filter orders by status
  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter((order: any) => order.status === statusFilter);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder({
        variables: {
          id: orderId,
          orderData: {
            status: newStatus
          }
        }
      });
      refetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder({
          variables: { id: orderId }
        });
        refetchOrders();
        if (selectedOrder === orderId) {
          setSelectedOrder(null);
        }
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaSpinner className="animate-spin" />;
      case 'processing': return <FaEdit />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'CANCELLED': return <FaTimes />;
      default: return <FaBox />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FFE31A] mb-8">Your Orders</h1>
        
        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-lg ${statusFilter === 'ALL' ? 'bg-[#FFE31A] text-gray-900' : 'bg-gray-800'}`}
          >
            All Orders
          </button>
          {['pending', 'processing', 'shipped', 'delivered', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${statusFilter === status ? `${getStatusColor(status)} text-white` : 'bg-gray-800'}`}
            >
              {getStatusIcon(status)} {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Order History</h2>
              {filteredOrders.length === 0 ? (
                <p className="text-gray-400">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order: any) => (
                    <div 
                      key={order.id}
                      onClick={() => setSelectedOrder(order.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedOrder === order.id ? 'bg-[#FFE31A] text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          {order.status !== 'CANCELLED' && order.status !== 'delivered' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 font-bold">${Number(order.totalAmount || 0).toFixed(2)}</p>
                      </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                {itemsLoading ? (
                  <div className="flex justify-center">
                    <FaSpinner className="animate-spin text-[#FFE31A] text-2xl" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Order Details</h2>
                      <span className={`px-3 py-1 rounded-full ${getStatusColor(orderItemsData?.orderItemsByOrder[0]?.order.status)}`}>
                        {orderItemsData?.orderItemsByOrder[0]?.order.status}
                      </span>
                    </div>

                    {/* Order Progress Tracker */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
                      <div className="flex items-center justify-between mb-2">
                        {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                          const orderStatus = orderItemsData?.orderItemsByOrder[0]?.order.status;
                          const isCompleted = 
                            status === 'pending' ||
                            (status === 'processing' && orderStatus !== 'pending') ||
                            (status === 'shipped' && ['shipped', 'delivered'].includes(orderStatus)) ||
                            (status === 'delivered' && orderStatus === 'delivered');
                          
                          const isCurrent = orderStatus === status;

                          return (
                            <div key={status} className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-[#FFE31A] text-gray-900' : 'bg-gray-700'} ${isCurrent ? 'ring-2 ring-[#FFE31A]' : ''}`}>
                                {isCompleted ? <FaCheck /> : index + 1}
                              </div>
                              <span className="text-xs text-center">{status}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Items</h3>
                      <div className="space-y-4">
                        {orderItemsData?.orderItemsByOrder.map((item: any) => (
                          <div key={item.id} className="flex border-b border-gray-700 pb-4">
                            <div className="w-20 h-20 bg-gray-700 rounded-lg mr-4 overflow-hidden">
                              {item.product.image && (
                                <img 
                                  src={`http://127.0.0.1:8000/media/${item.product.image}`} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              {item.variation && (
                                <p className="text-sm text-gray-400">
                                  {item.variation.variationType}: {item.variation.variationValue}
                                </p>
                              )}
                              <p className="text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">${Number(item.price || 0).toFixed(2)}</p>
                                <p className="text-sm">Total: ${(Number(item.price) * item.quantity).toFixed(2)}</p>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>  ${Number(orderItemsData?.orderItemsByOrder?.[0]?.order?.totalAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2">
                          <span>Total:</span>
                          <span>
                            {
                                orderItemsData?.orderItemsByOrder?.[0]?.order?.totalAmount !== undefined && 
                                typeof orderItemsData?.orderItemsByOrder[0]?.order?.totalAmount === "number"
                                ? `$${orderItemsData.orderItemsByOrder[0].order.totalAmount.toFixed(2)}`
                                : "N/A"
                            }
                            </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <p>{orderItemsData?.orderItemsByOrder[0]?.order.shippingAddress}</p>
                        <p className="mt-2">Payment Method: {orderItemsData?.orderItemsByOrder[0]?.order.paymentMethod || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    {orderItemsData?.orderItemsByOrder[0]?.order.status !== 'delivered' && 
                     orderItemsData?.orderItemsByOrder[0]?.order.status !== 'CANCELLED' && (
                      <div className="flex flex-wrap gap-2">
                        {orderItemsData?.orderItemsByOrder[0]?.order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder, 'processing')}
                              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                              Mark as Processing
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder, 'CANCELLED')}
                              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                            >
                              Cancel Order
                            </button>
                          </>
                        )}
                        {orderItemsData?.orderItemsByOrder[0]?.order.status === 'processing' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder, 'shipped')}
                            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {orderItemsData?.orderItemsByOrder[0]?.order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder, 'delivered')}
                            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <FaBox className="text-4xl text-[#FFE31A] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Select an order to view details</h3>
                  <p className="text-gray-400 mt-2">Click on any order from the list to see its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OrdersPage;