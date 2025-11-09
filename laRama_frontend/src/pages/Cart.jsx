import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/cart' } } });
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCart();
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    try {
      const response = await apiService.updateCartItem(cartItemId, newQuantity);
      if (response.success) {
        await fetchCart(); // Refresh cart
      } else {
        alert(response.message || 'Failed to update item');
      }
    } catch (error) {
      alert('Error updating item: ' + error.message);
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const removeFromCart = async (cartItemId) => {
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    try {
      const response = await apiService.removeFromCart(cartItemId);
      if (response.success) {
        await fetchCart(); // Refresh cart
      } else {
        alert(response.message || 'Failed to remove item');
      }
    } catch (error) {
      alert('Error removing item: ' + error.message);
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiService.clearCart();
      if (response.success) {
        await fetchCart(); // Refresh cart
      } else {
        alert(response.message || 'Failed to clear cart');
      }
    } catch (error) {
      alert('Error clearing cart: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const proceedToCheckout = () => {
    // Placeholder for checkout functionality
    alert('Checkout functionality will be implemented in the next phase!');
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0YwRTREMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVDNEIzRCI+UHJvZHVjdCBJbWFnZTwvdGV4dD48L3N2Zz4=';

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-[#FAF7F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A299] mx-auto mb-4"></div>
          <p className="text-[#5C4B3D]">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-6xl">
        <Link to="/products" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Continue Shopping
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Your Cart</h1>
          <p className="text-lg text-[#8C8A87]">
            Welcome back, {user?.name}! Review your selected items below.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {cart && cart.items && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-serif font-semibold text-[#5C4B3D]">
                      Cart Items ({cart.total_items})
                    </h2>
                    {cart.items.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.cart_item_id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-24 h-24 flex-shrink-0 bg-[#FAF7F3] rounded-lg overflow-hidden">
                        <img
                          src={item.product.image_url || fallbackSvg}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = fallbackSvg;
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-semibold text-[#5C4B3D] mb-1">{item.product.name}</h3>
                        <p className="text-sm text-[#8C8A87] mb-2">{item.product.category}</p>
                        <p className="font-medium text-[#D9A299]">{formatPrice(item.product.price)} each</p>
                        <p className="text-xs text-[#8C8A87]">Stock: {item.product.stock_quantity}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                            disabled={updating[item.cart_item_id]}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#D9A299] text-[#D9A299] hover:bg-[#D9A299] hover:text-white disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                            disabled={updating[item.cart_item_id] || item.quantity >= item.product.stock_quantity}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#D9A299] text-[#D9A299] hover:bg-[#D9A299] hover:text-white disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <p className="font-bold text-[#5C4B3D]">{formatPrice(item.item_total)}</p>
                        
                        <button
                          onClick={() => removeFromCart(item.cart_item_id)}
                          disabled={updating[item.cart_item_id]}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-serif font-semibold text-[#5C4B3D] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#8C8A87]">Subtotal ({cart.total_items} items)</span>
                    <span className="font-medium">{formatPrice(cart.cart_total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8A87]">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-[#5C4B3D]">Total</span>
                      <span className="text-lg font-bold text-[#D9A299]">{formatPrice(cart.cart_total)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 mb-4"
                >
                  Proceed to Checkout
                </button>
                
                <Link
                  to="/products"
                  className="block w-full text-center border border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
                
                <div className="mt-6 p-4 bg-[#FAF7F3] rounded-lg">
                  <h3 className="font-semibold text-[#5C4B3D] mb-2">Why LaRama?</h3>
                  <ul className="text-sm text-[#8C8A87] space-y-1">
                    <li>• Handcrafted with love</li>
                    <li>• Premium quality materials</li>
                    <li>• Unique designs</li>
                    <li>• Secure packaging</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#F0E4D3] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#D9A299]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#5C4B3D] mb-2">Your cart is empty</h3>
            <p className="text-[#8C8A87] mb-6">Discover our beautiful handcrafted collection and add some items to your cart.</p>
            <Link
              to="/products"
              className="inline-block bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;