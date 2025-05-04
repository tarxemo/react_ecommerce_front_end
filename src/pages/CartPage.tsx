import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_CARTS_BY_USER, 
  GET_CART_ITEMS_BY_CART,
  GET_ALL_CARTS
} from '../api/queries';
import { 
  CREATE_CART, 
  UPDATE_CART, 
  DELETE_CART,
  CREATE_CART_ITEM,
  UPDATE_CART_ITEM,
  DELETE_CART_ITEM
} from '../api/mutations';
import { useAuth } from '../utils/useAuth';
import { FaShoppingCart, FaTrash, FaEdit, FaSpinner, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCloudinaryUrl } from '../utils/cloudinary';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCart, setSelectedCart] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | 'ALL'>('ALL');
  const [newCartName, setNewCartName] = useState("New Cart");
  const [showCreateCartModal, setShowCreateCartModal] = useState(false);
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [editedCartName, setEditedCartName] = useState("");

  // Fetch user's carts
  const { data: cartsData, loading: cartsLoading, error: cartsError, refetch: refetchCarts } = useQuery(
    isAuthenticated ? GET_CARTS_BY_USER : GET_ALL_CARTS
  );

  // Fetch cart items when a cart is selected
  const { data: cartItemsData, loading: itemsLoading, refetch: refetchCartItems } = useQuery(GET_CART_ITEMS_BY_CART, {
    variables: { cartId: selectedCart },
    skip: !selectedCart
  });

  // Mutations
  const [createCart] = useMutation(CREATE_CART);
  const [updateCart] = useMutation(UPDATE_CART);
  const [deleteCart] = useMutation(DELETE_CART);
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);

  const [newCartItem, setNewCartItem] = useState({
    productId: '',
    variationId: '',
    quantity: 1,
    price: 0
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#FFE31A] mb-4">Please log in to manage your carts</h2>
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

  if (cartsLoading) return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex items-center justify-center">
      <FaSpinner className="animate-spin text-[#FFE31A] text-4xl" />
    </div>
  );

  if (cartsError) return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <p className="text-red-500">Error loading carts: {cartsError.message}</p>
    </div>
  );

  const carts = isAuthenticated ? cartsData?.cartsByCustomuser || [] : cartsData?.cartsByCustomuser || [];

  // Filter carts by active status
  const filteredCarts = activeFilter === 'ALL' 
    ? carts 
    : carts.filter((cart: any) => cart.isActive === activeFilter);

  const handleCreateCart = async () => {
    try {
      const { data } = await createCart({
        variables: {
          cartData: {
            isActive: true,
            name: newCartName
          }
        }
      });
      refetchCarts();
      setSelectedCart(data.createCart.cart.id);
      setShowCreateCartModal(false);
      setNewCartName("New Cart");
    } catch (err) {
      console.error('Error creating cart:', err);
    }
  };

  const handleEditCartName = async (cartId: string) => {
    try {
      await updateCart({
        variables: {
          cartData: {
            id: cartId,
            name: editedCartName
          }
        }
      });
      refetchCarts();
      setEditingCartId(null);
    } catch (err) {
      console.error('Error updating cart name:', err);
    }
  };

  const handleUpdateCartStatus = async (cartId: string, isActive: boolean) => {
    try {
      await updateCart({
        variables: {
          id: cartId,
          cartData: {
            isActive
          }
        }
      });
      refetchCarts();
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  const handleDeleteCart = async (cartId: string) => {
    if (window.confirm('Are you sure you want to delete this cart?')) {
      try {
        await deleteCart({
          variables: { id: cartId }
        });
        refetchCarts();
        if (selectedCart === cartId) {
          setSelectedCart(null);
        }
      } catch (err) {
        console.error('Error deleting cart:', err);
      }
    }
  };

  const handleAddItemToCart = async () => {
    if (!selectedCart) return;
    
    try {
      await createCartItem({
        variables: {
          cartItemData: {
            cartId: selectedCart,
            productId: newCartItem.productId,
            variationId: newCartItem.variationId || null,
            quantity: newCartItem.quantity,
            price: newCartItem.price
          }
        }
      });
      refetchCartItems();
      setNewCartItem({
        productId: '',
        variationId: '',
        quantity: 1,
        price: 0
      });
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  const handleUpdateCartItem = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem({
        variables: {
          id: itemId,
          cartItemData: {
            quantity
          }
        }
      });
      refetchCartItems();
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };

  const handleRemoveCartItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      try {
        await deleteCartItem({
          variables: { id: itemId }
        });
        refetchCartItems();
      } catch (err) {
        console.error('Error removing cart item:', err);
      }
    }
  };

  const calculateCartTotal = () => {
    if (!cartItemsData?.cartItemsByCart) return 0;
    return cartItemsData.cartItemsByCart.reduce(
      (total: number, item: any) => total + (item.price * item.quantity), 
      0
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#FFE31A] mb-8">Your Shopping Carts</h1>
          
          {/* Cart Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-2 rounded-lg ${activeFilter === 'ALL' ? 'bg-[#FFE31A] text-gray-900' : 'bg-gray-800'}`}
            >
              All Carts
            </button>
            <button
              onClick={() => setActiveFilter(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeFilter === true ? 'bg-green-500 text-white' : 'bg-gray-800'}`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter(false)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeFilter === false ? 'bg-gray-500 text-white' : 'bg-gray-800'}`}
            >
              Inactive
            </button>
            <button
              onClick={() => setShowCreateCartModal(true)}
              className="px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 ml-auto"
            >
              Create New Cart
            </button>
          </div>

          {/* Create Cart Modal */}
          {showCreateCartModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Create New Cart</h3>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Cart Name</label>
                  <input
                    type="text"
                    value={newCartName}
                    onChange={(e) => setNewCartName(e.target.value)}
                    className="w-full bg-gray-700 text-white p-2 rounded-lg"
                    placeholder="Enter cart name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCreateCartModal(false)}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCart}
                    className="px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Your Carts</h2>
                {filteredCarts.length === 0 ? (
                  <p className="text-gray-400">No carts found</p>
                ) : (
                  <div className="space-y-4">
                    {filteredCarts.map((cart: any) => (
                      <div 
                        key={cart.id}
                        onClick={() => setSelectedCart(cart.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedCart === cart.id ? 'bg-[#FFE31A] text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {editingCartId === cart.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editedCartName}
                                  onChange={(e) => setEditedCartName(e.target.value)}
                                  className="bg-gray-600 text-white p-1 rounded"
                                />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCartName(cart.id);
                                  }}
                                  className="text-green-500 hover:text-green-400"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCartId(null);
                                  }}
                                  className="text-gray-400 hover:text-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <h3 className="font-bold">
                                {cart.name || `Cart #${cart.id.slice(0, 8)}`}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCartId(cart.id);
                                    setEditedCartName(cart.name || "");
                                  }}
                                  className="ml-2 text-gray-400 hover:text-[#FFE31A]"
                                >
                                  <FaEdit size={14} />
                                </button>
                              </h3>
                            )}
                            <p className="text-sm">
                              {new Date(cart.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${cart.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                              {cart.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCart(cart.id);
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCartStatus(cart.id, !cart.isActive);
                            }}
                            className={`px-2 py-1 text-xs rounded ${cart.isActive ? 'bg-gray-600 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-500'}`}
                          >
                            {cart.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <p className="text-sm font-semibold">
                            Items: {cart.cartItems?.length || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Details */}
            <div className="lg:col-span-2">
              {selectedCart ? (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                  {itemsLoading ? (
                    <div className="flex justify-center">
                      <FaSpinner className="animate-spin text-[#FFE31A] text-2xl" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                          {carts.find((c: any) => c.id === selectedCart)?.name || `Cart #${selectedCart.slice(0, 8)}`}
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-gray-700">
                          {cartItemsData?.cartItemsByCart?.length || 0} items
                        </span>
                      </div>

                      {/* Cart Items */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Cart Items</h3>
                        {cartItemsData?.cartItemsByCart?.length === 0 ? (
                          <p className="text-gray-400">No items in this cart</p>
                        ) : (
                          <div className="space-y-4">
                            {cartItemsData?.cartItemsByCart?.map((item: any) => (
                              <div key={item.id} className="flex border-b border-gray-700 pb-4">
                                <div className="w-20 h-20 bg-gray-700 rounded-lg mr-4 overflow-hidden">
                                  {item.product.image && (
                                    <img 
                                      src={getCloudinaryUrl(item.product.image)}
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
                                  <div className="flex items-center mt-2">
                                    <button 
                                      onClick={() => handleUpdateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-l hover:bg-gray-600"
                                    >
                                      <FaMinus size={12} />
                                    </button>
                                    <span className="w-10 h-8 flex items-center justify-center bg-gray-700">
                                      {item.quantity}
                                    </span>
                                    <button 
                                      onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-r hover:bg-gray-600"
                                    >
                                      <FaPlus size={12} />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">${Number(item.price || 0).toFixed(2)}</p>
                                  <p className="text-sm">Total: ${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                  <button
                                    onClick={() => handleRemoveCartItem(item.id)}
                                    className="mt-2 text-red-500 hover:text-red-400"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add New Item Form */}
                      <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Add New Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Product ID</label>
                            <input
                              type="text"
                              value={newCartItem.productId}
                              onChange={(e) => setNewCartItem({...newCartItem, productId: e.target.value})}
                              className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
                              placeholder="Enter product ID"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Variation ID</label>
                            <input
                              type="text"
                              value={newCartItem.variationId}
                              onChange={(e) => setNewCartItem({...newCartItem, variationId: e.target.value})}
                              className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
                              placeholder="Optional"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Quantity</label>
                            <input
                              type="number"
                              value={newCartItem.quantity}
                              onChange={(e) => setNewCartItem({...newCartItem, quantity: parseInt(e.target.value) || 1})}
                              min="1"
                              className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Price</label>
                            <input
                              type="number"
                              value={newCartItem.price}
                              onChange={(e) => setNewCartItem({...newCartItem, price: parseFloat(e.target.value) || 0})}
                              step="0.01"
                              min="0"
                              className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <button
                              onClick={handleAddItemToCart}
                              className="px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90 w-full"
                            >
                              Add Item to Cart
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cart Summary */}
                      <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Cart Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${calculateCartTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Estimated Total:</span>
                            <span>${calculateCartTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cart Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={selectedCart ? `/checkout/${selectedCart}` : "#"}
                          className={`px-6 py-3 rounded-lg font-semibold ${
                            selectedCart ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Proceed to Checkout
                        </Link>

                        <button
                          onClick={() => {
                            const currentCart = carts.find((c: any) => c.id === selectedCart);
                            if (currentCart) {
                              handleUpdateCartStatus(selectedCart, !currentCart.isActive);
                            }
                          }}
                          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          {carts.find((c: any) => c.id === selectedCart)?.isActive ? 'Deactivate Cart' : 'Activate Cart'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <FaShoppingCart className="text-4xl text-[#FFE31A] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Select a cart to view details</h3>
                    <p className="text-gray-400 mt-2">Click on any cart from the list to see its contents</p>
                    <button
                      onClick={() => setShowCreateCartModal(true)}
                      className="mt-4 px-4 py-2 bg-[#FFE31A] text-gray-900 rounded-lg hover:bg-[#FFE31A]/90"
                    >
                      Create New Cart
                    </button>
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

export default CartPage;