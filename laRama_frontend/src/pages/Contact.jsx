/**
 * Contact Page Component - LaRama Frontend
 * Customer communication interface with contact form and business information
 * Features form validation, WhatsApp integration, and multiple contact channels
 * Provides comprehensive customer support and inquiry management
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Contact Component - Main Export Function
 * Handles customer inquiries through contact form and displays business contact information
 * Manages form state, validation, and submission for customer communication
 * 
 * @returns {JSX.Element} - Complete contact page with form and business information
 */
const Contact = () => {
  /**
   * Contact Form State Management
   * Manages all form fields for customer inquiry submission
   * Includes validation and reset functionality for optimal user experience
   */
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '', // Customer name for personalized response
    email: '', // Customer email for reply communication
    subject: '', // Inquiry topic for proper routing
    message: '' // Detailed customer message or question
  });

  /**
   * Form Field Change Handler
   * Updates form state when user modifies input fields
   * Provides real-time form state management for responsive interface
   * 
   * @param {Event} e - Input change event containing field name and value
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Form Submission Handler
   * Processes contact form submission and resets form state
   * Handles customer inquiry processing and confirmation feedback
   * 
   * @param {Event} e - Form submission event to prevent default behavior
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Development logging for form data review
    // console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form to initial state after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleLiveSupport = () => {
    const liveRoomId = encodeURIComponent('support-session');

    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: `/live/${liveRoomId}` } } });
      return;
    }

    navigate(`/live/${liveRoomId}`);
  };

  /**
   * Component JSX Return - Contact Page Interface
   * Renders complete contact page with navigation, hero section, and two-column layout
   * Features contact information display and interactive inquiry form
   */
  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        
        {/* Navigation - Back to Home Link */}
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        {/* Page Hero Section - Contact Introduction */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Get in Touch</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            Have questions about our handmade products or custom orders? We'd love to hear from you!
          </p>
          <button
            type="button"
            onClick={handleLiveSupport}
            className="inline-flex items-center justify-center rounded-full bg-[#5C4B3D] px-6 py-3 text-sm font-semibold text-[#F0E4D3] transition-all duration-300 hover:bg-[#3F3329]"
          >
            Start a live studio call
          </button>
        </div>

        {/* Two-Column Layout - Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Contact Information and Details */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#F0E4D3] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-[#D9A299]"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5C4B3D]">Email</h3>
                    <p className="text-[#8C8A87]">
                      <a href="mailto:larama.handmade@gmail.com" className="hover:text-[#D9A299] transition-colors">
                        larama.handmade@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#F0E4D3] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-[#D9A299]"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5C4B3D]">Phone</h3>
                    <p className="text-[#8C8A87]">+961 71 361 960</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F0E4D3]">
                <h3 className="font-semibold text-[#5C4B3D] mb-4">Business Hours</h3>
                <div className="space-y-2 text-[#8C8A87]">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/larama_handmade?igsh=ZGlnbno4ZjlvMnVp" target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-[#F0E4D3] rounded-full flex items-center justify-center hover:bg-[#D9A299] transition-colors">
                  <i className="fab fa-instagram text-[#5C4B3D] hover:text-white"></i>
                </a>

                <a href=" https://chat.whatsapp.com/IWq57Fg8fc61gDzIuR90lA?mode=wwt " target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-[#F0E4D3] rounded-full flex items-center justify-center hover:bg-[#D9A299] transition-colors">
                  <i className="fab fa-whatsapp text-[#5C4B3D] hover:text-white"></i>
                </a>
                <a href="https://www.pinterest.com/laramahandmade/" target='_blank' rel='noopener noreferrer' className="w-12 h-12 bg-[#F0E4D3] rounded-full flex items-center justify-center hover:bg-[#D9A299] transition-colors">
                  <i className="fab fa-pinterest text-[#5C4B3D] hover:text-white"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#5C4B3D] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#5C4B3D] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#5C4B3D] mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="custom">Custom Order Request</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="shipping">Shipping Question</option>
                  <option value="return">Return Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#5C4B3D] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;