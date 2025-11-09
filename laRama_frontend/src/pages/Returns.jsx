import { useState } from 'react';
import { Link } from 'react-router-dom';

const Returns = () => {
  const [activeTab, setActiveTab] = useState('returns');

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Returns & Refunds</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            We stand behind our craftsmanship. Here's our policy for returns and exchanges.
          </p>
        </div>

        <div className="flex border-b border-[#DCC5B2] mb-8">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'returns'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            Returns Policy
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'process'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            Return Process
          </button>
          <button
            onClick={() => setActiveTab('exchanges')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'exchanges'
                ? 'text-[#D9A299] border-b-2 border-[#D9A299]'
                : 'text-[#8C8A87] hover:text-[#5C4B3D]'
            }`}
          >
            Exchanges
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-[#FAF7F3] rounded-lg">
                <div className="w-8 h-8 bg-[#D9A299] rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info-circle text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-[#5C4B3D] mb-2">Important Note</h3>
                  <p className="text-[#5C4B3D]">
                    Due to the handmade nature of our products, we can only accept returns for damaged or defective items. 
                    Each piece is unique and made with care, so we appreciate your understanding.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-[#F0E4D3] rounded-lg">
                  <div className="w-12 h-12 bg-[#F0E4D3] rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-check-circle text-[#D9A299] text-xl"></i>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">What We Accept</h3>
                  <ul className="text-[#5C4B3D] space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-[#D9A299] mt-1 mr-2"></i>
                      Damaged during shipping
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-[#D9A299] mt-1 mr-2"></i>
                      Manufacturing defects
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-[#D9A299] mt-1 mr-2"></i>
                      Incorrect item received
                    </li>
                  </ul>
                </div>

                <div className="p-6 border border-[#F0E4D3] rounded-lg">
                  <div className="w-12 h-12 bg-[#F0E4D3] rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-times-circle text-[#8C8A87] text-xl"></i>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">What We Cannot Accept</h3>
                  <ul className="text-[#5C4B3D] space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-times text-[#8C8A87] mt-1 mr-2"></i>
                      Change of mind
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-times text-[#8C8A87] mt-1 mr-2"></i>
                      Color variations (natural to handmade items)
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-times text-[#8C8A87] mt-1 mr-2"></i>
                      Items used or altered
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Timeframe for Returns</h3>
                <p className="text-[#5C4B3D]">
                  Please contact us within <span className="font-semibold">7 days</span> of receiving your item 
                  to initiate a return. Returns must be shipped back to us within <span className="font-semibold">14 days</span> 
                  of approval.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[#FAF7F3] rounded-lg">
                  <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Contact Us</h3>
                  <p className="text-[#5C4B3D] text-sm">
                    Email us at larama.handmade@gmail.com within 7 days of receipt with your order number and photos of the issue.
                  </p>
                </div>

                <div className="text-center p-6 bg-[#FAF7F3] rounded-lg">
                  <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Get Approval</h3>
                  <p className="text-[#5C4B3D] text-sm">
                    We'll review your request and provide return instructions within 2 business days.
                  </p>
                </div>

                <div className="text-center p-6 bg-[#FAF7F3] rounded-lg">
                  <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Ship & Receive</h3>
                  <p className="text-[#5C4B3D] text-sm">
                    Ship the item back to us. Once received, we'll process your refund or replacement.
                  </p>
                </div>
              </div>

              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Shipping Instructions</h3>
                <ul className="text-[#5C4B3D] space-y-2">
                  <li>• Use the original packaging if possible</li>
                  <li>• Include your order number inside the package</li>
                  <li>• We recommend using a trackable shipping service</li>
                  <li>• Return shipping costs are covered by us for damaged/defective items</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'exchanges' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Exchange Policy</h3>
                <p className="text-[#5C4B3D]">
                  We understand that sometimes an item might not be exactly what you envisioned. 
                  While we cannot accept returns for change of mind, we're happy to work with you 
                  to find a solution.
                </p>
              </div>

              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">Exchange Options</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-arrow-right text-[#D9A299] mt-1"></i>
                    <p className="text-[#5C4B3D]">
                      <span className="font-semibold">Store Credit:</span> Receive full credit toward any future purchase
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-arrow-right text-[#D9A299] mt-1"></i>
                    <p className="text-[#5C4B3D]">
                      <span className="font-semibold">Custom Modification:</span> For custom pieces, we may be able to modify the item
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-arrow-right text-[#D9A299] mt-1"></i>
                    <p className="text-[#5C4B3D]">
                      <span className="font-semibold">Special Circumstances:</span> Contact us to discuss your specific situation
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-[#F0E4D3] rounded-lg">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-4">How to Request an Exchange</h3>
                <p className="text-[#5C4B3D] mb-4">
                  Email us at <span className="text-[#D9A299] font-semibold"> larama.handmade@gmail.com</span> with:
                </p>
                <ul className="text-[#5C4B3D] space-y-2 list-disc list-inside">
                  <li>Your order number</li>
                  <li>Photos of the item</li>
                  <li>What you'd like instead</li>
                  <li>Any other relevant details</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-[#F0E4D3] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-4">Need Help with a Return?</h2>
          <p className="text-[#5C4B3D] mb-6">Our customer care team is here to assist you with any questions.</p>
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
            Email Returns Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default Returns;