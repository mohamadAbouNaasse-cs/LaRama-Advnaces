/**
 * Footer Component - LaRama Frontend
 * Site-wide footer with navigation links, newsletter signup, and business information
 * Features newsletter integration, social media links, and comprehensive site navigation
 * Provides consistent brand presence and customer engagement opportunities
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/api";

/**
 * Footer Component - Main Export Function
 * Comprehensive site footer with multi-column layout and interactive features
 * Manages newsletter subscription, navigation links, and business contact information
 * 
 * @returns {JSX.Element} - Complete footer with branding, navigation, and newsletter signup
 */
const Footer = () => {
  // Newsletter subscription state management
  const [email, setEmail] = useState(''); // User email input for newsletter
  const [isSubscribed, setIsSubscribed] = useState(false); // Success state indicator
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  /**
   * Newsletter Subscription Handler
   * Processes newsletter signup through API integration with validation and feedback
   * Handles various subscription states: new, existing, and reactivation scenarios
   * 
   * @param {Event} e - Form submission event to prevent default behavior
   */
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Validate email input before API call
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Call newsletter subscription API with user email and source tracking
      const response = await apiService.subscribeNewsletter(email.trim(), 'footer');
      
      if (response.success) {
        setIsSubscribed(true);
        setEmail(''); // Clear form after successful subscription
        
        // Log subscription status for development debugging
        if (response.already_subscribed) {
          // Development logging for already subscribed users
        } else if (response.reactivated) {
          // Development logging for reactivated subscriptions
        } else {
          // Development logging for new subscriptions
        }
        
        // Auto-hide success message after 3 seconds for clean UX
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        // Display error message for failed subscription attempts
        alert(response.message || 'Failed to subscribe to newsletter');
      }
    } catch {
      // Handle network or API errors gracefully
      alert('Failed to subscribe to newsletter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Component JSX Return - Footer Interface
   * Renders comprehensive site footer with four-column responsive grid layout
   * Features brand information, navigation links, newsletter signup, and social media
   */
  return (
    <footer className="bg-[#5C4B3D] text-[#F0E4D3] pt-12 pb-8 px-6 transition-colors duration-700">
      <div className="container mx-auto">
        
        {/* Main Footer Content Grid - Four Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column - Logo and Company Information */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F0E4D3] to-[#DCC5B2] rounded-full flex items-center justify-center shadow-lg border-2 border-[#F0E4D3] overflow-hidden">
                <img
                  src="/larama-logo-img.ico"
                  alt="LaRama Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
              </div>
              <span className="text-[#F0E4D3] font-serif text-2xl font-bold">LaRama</span>
            </Link>
            <p className="text-[#DCC5B2] mb-4">
              Handcrafted treasures made with love and traditional techniques.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/larama_handmade?igsh=ZGlnbno4ZjlvMnVp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a 
                href=" https://chat.whatsapp.com/IWq57Fg8fc61gDzIuR90lA?mode=wwt " 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors"
                aria-label="Message us on WhatsApp"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a 
                href="https://www.pinterest.com/laramahandmade/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors"
                aria-label="Follow us on Pinterest"
              >
                <i className="fab fa-pinterest text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Products</Link></li>
              <li><Link to="/customize" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Custom Orders</Link></li>
              <li><Link to="/about" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-[#DCC5B2] mb-4">Get news about new products and workshops</p>
            
            {isSubscribed ? (
              <div className="bg-[#D9A299] text-white p-3 rounded-full text-center animate-pulse">
                <i className="fas fa-check-circle mr-2"></i>
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-full bg-[#F0E4D3] text-[#5C4B3D] placeholder-[#8C8A87] focus:outline-none focus:ring-2 focus:ring-[#D9A299]"
                  required
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#D9A299] hover:bg-[#c18981] disabled:bg-[#8C8A87] text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-[#8C8A87] pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#DCC5B2] text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} LaRama Handcrafted. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[#DCC5B2] hover:text-[#D9A299] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;