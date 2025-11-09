import { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingOption, setShippingOption] = useState('standard');

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateShippingCost = () => {
    if (cartItems.length === 0) return 0;
    
    switch(shippingOption) {
      case 'express':
        return 15.00;
      case 'regional':
        return 15.00; 
      case 'international':
        return 20.00; 
      case 'standard':
      default:
        return 5.00;
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = calculateShippingCost();
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Your Cart</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            Review your handcrafted treasures and proceed to checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-[#F0E4D3] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shopping-cart text-[#D9A299] text-3xl"></i>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-[#5C4B3D] mb-4">Your cart is empty</h3>
            <p className="text-[#8C8A87] mb-8 max-w-md mx-auto">
              Discover our beautiful handcrafted pieces and add something special to your cart.
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-[#F0E4D3]">
                  <h2 className="text-xl font-serif font-semibold text-[#5C4B3D]">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-[#F0E4D3]">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start gap-4 group">
                      <div className="w-full sm:w-24 h-24 bg-[#FAF7F3] rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0YwRTREMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVDNEIzRCI+UHJvZHVjdCBJbWFnZTwvdGV4dD48L3N2Zz4=';
                            e.target.className = "w-full h-full object-cover";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-serif font-semibold text-[#5C4B3D] text-lg mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-[#D9A299] font-bold">${item.price.toFixed(2)}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[#8C8A87] hover:text-[#D9A299] transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        
                        <div className="mt-4 flex items-center">
                          <div className="flex items-center border border-[#DCC5B2] rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-[#5C4B3D] hover:bg-[#F0E4D3] transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 bg-white text-[#5C4B3D] font-medium">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-[#5C4B3D] hover:bg-[#F0E4D3] transition-colors"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="ml-auto">
                            <p className="text-[#5C4B3D] font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t border-[#F0E4D3] bg-[#FAF7F3]">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center text-[#5C4B3D] hover:text-[#D9A299] transition-colors"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-[#F0E4D3]">
                  <h2 className="text-xl font-serif font-semibold text-[#5C4B3D]">
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#5C4B3D] mb-3">Shipping Method</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 p-2 border border-[#DCC5B2] rounded-lg hover:bg-[#FAF7F3] cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingOption === 'standard'}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="text-[#D9A299] focus:ring-[#D9A299]"
                        />
                        <div className="flex-1">
                          <p className="text-[#5C4B3D] font-medium">Standard Delivery</p>
                          <p className="text-[#8C8A87] text-sm">$5.00 • 2-4 business days</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-2 border border-[#DCC5B2] rounded-lg hover:bg-[#FAF7F3] cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingOption === 'express'}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="text-[#D9A299] focus:ring-[#D9A299]"
                        />
                        <div className="flex-1">
                          <p className="text-[#5C4B3D] font-medium">Express Delivery</p>
                          <p className="text-[#8C8A87] text-sm">$15.00 • 1-2 business days</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-2 border border-[#DCC5B2] rounded-lg hover:bg-[#FAF7F3] cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="regional"
                          checked={shippingOption === 'regional'}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="text-[#D9A299] focus:ring-[#D9A299]"
                        />
                        <div className="flex-1">
                          <p className="text-[#5C4B3D] font-medium">Regional Shipping</p>
                          <p className="text-[#8C8A87] text-sm">Starting at $15.00 • 7-14 days</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-2 border border-[#DCC5B2] rounded-lg hover:bg-[#FAF7F3] cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="international"
                          checked={shippingOption === 'international'}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="text-[#D9A299] focus:ring-[#D9A299]"
                        />
                        <div className="flex-1">
                          <p className="text-[#5C4B3D] font-medium">International</p>
                          <p className="text-[#8C8A87] text-sm">Starting at $20.00 • 2-4 weeks</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-[#5C4B3D]">Subtotal</span>
                      <span className="text-[#5C4B3D] font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#5C4B3D]">Shipping</span>
                      <span className="text-[#5C4B3D] font-semibold">
                        {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    
                    {subtotal > 100 && shippingOption === 'standard' && (
                      <div className="flex justify-between">
                        <span className="text-[#D9A299]">Free Shipping Discount</span>
                        <span className="text-[#D9A299] font-semibold">-$5.00</span>
                      </div>
                    )}
                    
                    <div className="border-t border-[#F0E4D3] pt-4 mt-2">
                      <div className="flex justify-between">
                        <span className="text-[#5C4B3D] font-semibold text-lg">Total</span>
                        <span className="text-[#5C4B3D] font-bold text-lg">
                          ${subtotal > 100 && shippingOption === 'standard' ? (subtotal).toFixed(2) : total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md mb-4">
                    Proceed to Checkout
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-[#8C8A87]">
                      or{' '}
                      <Link to="/contact" className="text-[#D9A299] hover:underline">
                        contact us for custom orders
                      </Link>
                    </p>
                  </div>
                </div>
                
                <div className="p-6 border-t border-[#F0E4D3] bg-[#FAF7F3]">
                  <div className="flex justify-center space-x-6">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-lock text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-[#5C4B3D]">Secure Checkout</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-10 h-10 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-shield-alt text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-[#5C4B3D]">Payment Protection</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-10 h-10 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-truck text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-[#5C4B3D]">Fast Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-[#F0E4D3] rounded-lg p-6 text-center">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Need Help?</h3>
                <p className="text-[#5C4B3D] text-sm mb-4">
                  Our team is here to assist you with your order.
                </p>
                <Link 
                  to="/contact" 
                  className="inline-block bg-white text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 text-sm"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;