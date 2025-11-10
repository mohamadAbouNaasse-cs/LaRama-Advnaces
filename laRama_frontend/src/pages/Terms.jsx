/**
 * Terms of Service Page Component - LaRama Frontend
 * Legal compliance page outlining service terms, conditions, and user agreements
 * Provides structured legal framework for customer interactions and business operations
 * Essential for legal protection and transparent business relationship establishment
 */

import { Link } from 'react-router-dom';

/**
 * Terms Component - Main Export Function
 * Static legal document page detailing LaRama's terms of service and user agreements
 * Covers product policies, custom orders, shipping, returns, and intellectual property
 * 
 * @returns {JSX.Element} - Complete terms of service page with structured legal content
 */
const Terms = () => {
  /**
   * Component JSX Return - Terms of Service Interface
   * Renders structured legal document with navigation and sectioned legal content
   * Features responsive design and clear hierarchy for legal document review
   */
  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        
        {/* Navigation - Back to Home Link */}
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        {/* Terms of Service Document Container */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-6">Terms of Service</h1>
          
          {/* Last Updated Timestamp - Dynamic Date Display */}
          <p className="text-sm text-[#8C8A87] mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg text-[#5C4B3D]">
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">1. Introduction</h2>
              <p>Welcome to LaRama Handcrafted. These Terms of Service govern your use of our website and services. By accessing or using our site, you agree to be bound by these terms.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">2. Products and Orders</h2>
              <p>All products are handmade and may have slight variations, which we consider part of their unique charm. We strive to represent our products accurately through photographs and descriptions.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">3. Custom Orders</h2>
              <p>Custom orders require a 50% deposit upfront. Once production begins, deposits are non-refundable. Completion times vary based on complexity and current workload.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">4. Shipping and Returns</h2>
              <p>We ship within 3-5 business days after order completion. Due to the handmade nature of our products, we only accept returns for damaged items. Please contact us within 7 days of receipt.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-serif font-semibold mb-4">5. Intellectual Property</h2>
              <p>All designs, logos, and content are property of LaRama Handcrafted. You may not reproduce, distribute, or create derivative works without permission.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-serif font-semibold mb-4">6. Contact Us</h2>
              <p>For questions about these terms, please contact us at <span className="text-[#D9A299]">larama.handmade@gmail.com</span></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;