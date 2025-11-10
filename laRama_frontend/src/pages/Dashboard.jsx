/**
 * User Dashboard Component - LaRama Frontend
 * Personal hub for authenticated users with navigation to key features
 * Displays personalized greeting, quick actions, and account management options
 * Serves as the main landing page after successful authentication
 */

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Dashboard Component - Main Export Function
 * Protected user interface providing access to account features and personalized content
 * Displays user-specific greeting and navigation cards for main application features
 * 
 * @returns {JSX.Element} - Complete dashboard interface with personalized content and action cards
 */
const Dashboard = () => {
  // Access current user information from authentication context
  const { user } = useAuth();
  
  // Generate display name with fallback hierarchy: name > email prefix > generic greeting
  const displayName = user?.name || user?.email?.split("@")[0] || "Style Enthusiast";

  /**
   * Component JSX Return - Dashboard Interface
   * Renders personalized dashboard with welcome header and feature navigation cards
   * Uses LaRama brand colors and responsive grid layout for optimal user experience
   */
  return (
    <section className="min-h-[70vh] bg-[#F0E4D3] py-16 px-6 text-[#5C4B3D] transition-colors duration-700">
      <div className="container mx-auto max-w-5xl">
        
        {/* Welcome Header Section - Personalized User Greeting */}
        <header className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A3846C]">Welcome</p>
          <h1 className="mt-2 text-4xl font-serif font-bold">Hello, {displayName}</h1>
          <p className="mt-4 text-base md:text-lg text-[#7A6654]">
            Your personal LaRama hub for curated looks, order tracking, and bespoke wardrobe inspiration.
          </p>
        </header>

        {/* Feature Navigation Grid - Three Main Dashboard Actions */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Saved Styles Card - Product Collection Access */}
          <article className="rounded-3xl bg-white/70 p-6 shadow-lg shadow-[#d4bda8]/50 backdrop-blur">
            <h2 className="text-lg font-semibold text-[#5C4B3D]">Saved Styles</h2>
            <p className="mt-3 text-sm text-[#7A6654]">
              Revisit your handpicked outfits and mood boards whenever inspiration strikes.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex items-center rounded-full bg-[#5C4B3D] px-4 py-2 text-sm font-semibold text-[#F0E4D3] transition-all duration-300 hover:bg-[#3F3329]"
            >
              Explore collections
            </Link>
          </article>

          {/* Orders Management Card - Customer Service Access */}
          <article className="rounded-3xl bg-white/70 p-6 shadow-lg shadow-[#d4bda8]/50 backdrop-blur">
            <h2 className="text-lg font-semibold text-[#5C4B3D]">Orders</h2>
            <p className="mt-3 text-sm text-[#7A6654]">
              Track recent purchases, follow shipments, and manage returns with ease.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center rounded-full border border-[#5C4B3D] px-4 py-2 text-sm font-semibold text-[#5C4B3D] transition-all duration-300 hover:bg-[#5C4B3D] hover:text-[#F0E4D3]"
            >
              Need assistance?
            </Link>
          </article>

          {/* Preferences Management Card - Customization Access */}
          <article className="rounded-3xl bg-white/70 p-6 shadow-lg shadow-[#d4bda8]/50 backdrop-blur">
            <h2 className="text-lg font-semibold text-[#5C4B3D]">Preferences</h2>
            <p className="mt-3 text-sm text-[#7A6654]">
              Update profile details, manage your newsletter, and fine-tune your aesthetic.
            </p>
            <Link
              to="/customize"
              className="mt-5 inline-flex items-center rounded-full bg-gradient-to-r from-[#DCC5B2] to-[#BFA087] px-4 py-2 text-sm font-semibold text-[#5C4B3D] transition-all duration-300 hover:from-[#BFA087] hover:to-[#DCC5B2]"
            >
              Personalize now
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;