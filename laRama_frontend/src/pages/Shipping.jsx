import { useState } from 'react';
import { Link } from 'react-router-dom';

const Shipping = () => {
  const [activeTab, setActiveTab] = useState('lebanon');
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

 
  const checkOrderStatus = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsLoading(true);
     
    //just for trial
    setTimeout(() => {
      const mockStatuses = [
        { id: 'LR1001', status: 'Under Creation', description: 'Your handmade item is being crafted with care.' },
        { id: 'LR1002', status: 'Delivered to Shipper', description: 'Your order has been handed to our shipping partner.' },
        { id: 'LR1003', status: 'Completed/Received', description: 'Your order has been successfully delivered.' },
        { id: 'LR1004', status: 'Waiting in Queue', description: 'Your order is in queue for production.' },
      ];
      
      const foundOrder = mockStatuses.find(order => order.id === orderId.toUpperCase());
      
      if (foundOrder) {
        setOrderStatus(foundOrder);
      } else {
        setOrderStatus({ 
          status: 'Not Found', 
          description: 'No order found with this ID. Please check your order number and try again.' 
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Shipping Information</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            We carefully package and ship each handmade piece from Lebanon with the care it deserves.
          </p>
        </div>

        <div className="flex border-b border-[#DCC5B2] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lebanon')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'lebanon'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            Within Lebanon
          </button>
          <button
            onClick={() => setActiveTab('regional')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'regional'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            Regional Countries
          </button>
          <button
            onClick={() => setActiveTab('international')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'international'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            International
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            Order Status
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">

          {activeTab === 'lebanon' && (
            <div className="space-y-6">
              {activeTab === 'lebanon' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#FAF7F3] rounded-lg">
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-truck text-white text-xl"></i>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Standard Delivery</h3>
                  <p className="text-[#5C4B3D] mb-3">
                    <span className="font-semibold">$5.00</span> • 2-4 business days
                  </p>
                  <ul className="text-[#5C4B3D] space-y-1 text-sm">
                    <li>• Delivery across Lebanon</li>
                    <li>• Cash on delivery available</li>
                    <li>• Free delivery for orders over $100.00</li>
                  </ul>
                </div>

                <div className="p-6 bg-[#FAF7F3] rounded-lg">
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-shipping-fast text-white text-xl"></i>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Express Delivery</h3>
                  <p className="text-[#5C4B3D] mb-3">
                    <span className="font-semibold">$15.00</span> • 1-2 business days
                  </p>
                  <ul className="text-[#5C4B3D] space-y-1 text-sm">
                    <li>• Priority handling</li>
                    <li>• Next-day delivery for Beirut area</li>
                    <li>• Before 5 PM order cutoff</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Free Delivery</h3>
                <p className="text-[#5C4B3D]">
                  Enjoy <span className="font-semibold text-[#D9A299]">free standard delivery</span> on all orders over $100.00 anywhere in Lebanon.
                </p>
              </div>

              <div className="p-6 bg-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Packaging Care</h3>
                <p className="text-[#5C4B3D]">
                  Each handmade piece is carefully wrapped in tissue paper, placed in a protective box, 
                  and cushioned with packing materials to ensure it arrives safely to your doorstep.
                </p>
              </div>
            </div>
          )}
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="space-y-6">
{activeTab === 'regional' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FAF7F3] rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-globe-asia text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Regional Shipping</h3>
                    <p className="text-[#5C4B3D]">
                      We ship to nearby countries including Syria, Jordan, Turkey, and Egypt. 
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-[#F0E4D3] rounded-lg">
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Shipping Costs & Times</h3>
                  <ul className="text-[#5C4B3D] space-y-2">
                    <li>• <span className="font-semibold">Syria & Jordan:</span> $15 - 7-10 business days</li>
                    <li>• <span className="font-semibold">Turkey:</span> $20 - 10-14 business days</li>
                    <li>• <span className="font-semibold">Egypt:</span> $18 - 8-12 business days</li>
                    <li>• Other nearby countries: Calculated at checkout</li>
                  </ul>
                </div>

                <div className="p-6 border border-[#F0E4D3] rounded-lg">
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Important Information</h3>
                  <ul className="text-[#5C4B3D] space-y-2">
                    <li>• Customs fees may apply (customer's responsibility)</li>
                    <li>• Delivery times are estimates only</li>
                    <li>• Contact us for specific country inquiries</li>
                    <li>• Payment must be completed before shipping</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Customs & Regulations</h3>
                <p className="text-[#5C4B3D]">
                  Regional customers are responsible for any customs fees, import taxes, or duties 
                  charged by their country. These fees are not included in the shipping cost and are 
                  collected by the local customs office upon delivery.
                </p>
              </div>
            </div>
          )}
            </div>
          )}

          {activeTab === 'international' && (
            <div className="space-y-6">
{activeTab === 'international' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FAF7F3] rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-globe text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Worldwide Shipping</h3>
                    <p className="text-[#5C4B3D]">
                      We can ship to most countries worldwide. Contact us for specific shipping quotes 
                      and delivery estimates for your location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-[#F0E4D3] rounded-lg">
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Shipping Information</h3>
                  <ul className="text-[#5C4B3D] space-y-2">
                    <li>• Shipping costs vary by destination</li>
                    <li>• Typically 2-4 weeks delivery time</li>
                    <li>• Fully tracked shipping available</li>
                    <li>• Insurance included for valuable items</li>
                  </ul>
                </div>

                <div className="p-6 border border-[#F0E4D3] rounded-lg">
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Order Process</h3>
                  <ul className="text-[#5C4B3D] space-y-2">
                    <li>1. Contact us with your desired items</li>
                    <li>2. We'll provide a shipping quote</li>
                    <li>3. Complete payment</li>
                    <li>4. We ship your order</li>
                    <li>5. Receive tracking information</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Important Notes</h3>
                <p className="text-[#5C4B3D]">
                  International customers are responsible for all customs fees, import taxes, and duties. 
                  These are not included in our shipping costs. Delivery times are estimates and may vary 
                  based on customs processing in your country.
                </p>
              </div>
            </div>
          )}
            </div>
          )}

   
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FAF7F3] rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clipboard-list text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Check Your Order Status</h3>
                    <p className="text-[#5C4B3D]">
                      Enter your order number to check the current status of your purchase.
                    </p>
                  </div>
                </div>
              </div>


              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <form onSubmit={checkOrderStatus} className="space-y-4">
                  <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-[#5C4B3D] mb-2">
                      Order Number *
                    </label>
                    <input
                      type="text"
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent"
                      placeholder="Enter your order number (e.g., LR1001)"
                      required
                    />
                    <p className="text-sm text-[#8C8A87] mt-2">
                      Your order number can be found in your confirmation email.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#D9A299] hover:bg-[#c18981] disabled:bg-[#DCC5B2] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
                  >
                    {isLoading ? 'Checking Status...' : 'Check Status'}
                  </button>
                </form>
              </div>

              
              {orderStatus && (
                <div className={`p-6 rounded-lg ${
                  orderStatus.status === 'Not Found' 
                    ? 'bg-[#FFEDED] border border-[#F5C6C6]' 
                    : 'bg-[#F0F9FF] border border-[#B8E2F2]'
                }`}>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">
                    Order Status: {orderStatus.status}
                  </h3>
                  <p className="text-[#5C4B3D] mb-4">
                    {orderStatus.description}
                  </p>
                  {orderStatus.id && (
                    <p className="text-sm text-[#8C8A87]">
                      Order ID: {orderStatus.id}
                    </p>
                  )}
                </div>
              )}

              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Order Status Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">1</span>
                    </div>
                    <span className="text-[#5C4B3D]">Waiting in Queue</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">2</span>
                    </div>
                    <span className="text-[#5C4B3D]">Under Creation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">3</span>
                    </div>
                    <span className="text-[#5C4B3D]">Delivered to Shipper</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">4</span>
                    </div>
                    <span className="text-[#5C4B3D]">Completed/Received</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Need More Help?</h3>
                <p className="text-[#5C4B3D] mb-4">
                  If you need additional assistance with your order, contact us through:
                </p>
                <ul className="text-[#5C4B3D] space-y-2">
                  <li>• <span className="font-semibold">Email:</span> larama.handmade@gmail.com</li>
                  <li>• <span className="font-semibold">WhatsApp:</span> +961 71 361 960</li>
                  <li>• <span className="font-semibold">Phone:</span> +961 03 263 792</li>
                </ul>
                <p className="text-[#5C4B3D] mt-4 text-sm">
                  Please have your order number ready when contacting us.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-[#F0E4D3] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-4">Need Shipping Help?</h2>
          <p className="text-[#5C4B3D] mb-6">Our team is here to assist you with any shipping questions or concerns.</p>
          <Link 
            to="/contact" 
            className="inline-block bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md mr-4"
          >
            Contact Support
          </Link>
          <a 
            href="mailto:larama.handmade@gmail.com" 
            className="inline-block border-2 border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
          >
            Email Shipping Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shipping;