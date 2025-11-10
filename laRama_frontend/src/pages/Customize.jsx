/**
 * Product Customization Page Component - LaRama Frontend
 * Interactive design tool for custom beadwork product creation
 * Features three-category system: Purses, Prayer Beads, and Other items
 * Includes real-time price calculation and WhatsApp order integration
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// Product category images for customization preview
import purseArt from "../assets/products-images/white-snow.jpg";
import necktie from "../assets/products-images/necktie.jpg";
import prayerBeads from "../assets/products-images/prayer.jpg";

/**
 * Customization Options Configuration
 * Defines available materials, colors, and specifications for each product category
 */

// Universal bead types available across all product categories
const beadTypes = ["Glass", "Seed", "Wooden", "Stone", "Crystal", "Clay", "Metal", "Acrylic"];

// Universal color options for all customizable products
const colors = ["Red", "Blue", "Green", "Black", "White", "Gold", "Silver", "Pink", "Brown", "Transparent"];

/**
 * Category-Specific Configuration Objects
 * Define available options and specifications for each product category
 * Organized by product type with relevant customization choices
 */

// Purse and handbag customization options
const purseOptions = {
  chainTypes: ["Metal", "Fabric", "None"], // Available chain/strap types
  decorationTypes: ["Crystals", "Embroidery", "Mixed Materials"], // Decorative enhancement options
  sizes: ["Small", "Medium", "Large"] // Size categories for purses
};

// Prayer beads and rosary customization options
const prayerBeadOptions = {
  decorationTypes: ["Tassel", "Charm", "Plain"], // Finishing decoration options
  beadCounts: ["33", "66", "99"], // Traditional bead count configurations
  stringMaterials: ["Nylon", "Silk", "Elastic"] // String material choices for durability and feel
};

// Other products customization options (neckties, accessories, decorative items)
const otherOptions = {
  productTypes: ["Tie", "Bracelet", "Keychain", "Necklace"], // Available product types
  decorations: ["Bead Pattern", "Embroidery", "None"], // Decorative treatment options
  materials: ["Fabric", "Wood", "Mixed"] // Base material choices for construction
};

/**
 * Customize Component - Main Export Function
 * Interactive product customization interface with multi-category support
 * Manages form state, validation, and WhatsApp integration for custom orders
 * 
 * @returns {JSX.Element} - Complete customization interface with tabbed navigation
 */
const Customize = () => {
  // Primary navigation state - controls active product category tab
  const [activeTab, setActiveTab] = useState("purses");
  
  /**
   * Universal Form State - Common Across All Product Categories
   * These options are available for all product types
   */
  const [beadType, setBeadType] = useState(""); // Selected bead material type
  const [color, setColor] = useState(""); // Selected primary color
  
  /**
   * Purse-Specific State Management
   * Handles configuration options unique to handbags and purses
   */
  const [chainType, setChainType] = useState(""); // Chain/strap material selection
  const [purseDecorations, setPurseDecorations] = useState([]); // Array of selected decorative options
  const [purseSize, setPurseSize] = useState(""); // Size category selection
  
  /**
   * Prayer Beads-Specific State Management
   * Manages religious/spiritual beadwork customization options
   */
  const [prayerDecorations, setPrayerDecorations] = useState([]); // Array of decorative enhancements
  const [beadCount, setBeadCount] = useState(""); // Number of beads in sequence
  const [stringMaterial, setStringMaterial] = useState(""); // String/cord material selection
  
  /**
   * Other Products State Management
   * Handles miscellaneous items like neckties, keychains, decorative pieces
   */
  const [productType, setProductType] = useState(""); // Specific product category
  const [otherDecorations, setOtherDecorations] = useState([]); // Array of decoration options
  const [material, setMaterial] = useState(""); // Base material selection

  /**
   * Decoration Selection Handler
   * Manages multi-selection checkboxes for decorative options across all product categories
   * Supports toggle functionality - adds/removes decorations from category-specific arrays
   * 
   * @param {string} decoration - The decoration option being toggled
   * @param {string} category - Product category ('purse', 'prayer', 'other')
   */
  const handleDecorationChange = (decoration, category) => {
    if (category === "purse") {
      // Toggle decoration in purse decorations array
      setPurseDecorations(prev => 
        prev.includes(decoration) 
          ? prev.filter(d => d !== decoration) // Remove if already selected
          : [...prev, decoration] // Add if not selected
      );
    } else if (category === "prayer") {
      // Toggle decoration in prayer beads decorations array
      setPrayerDecorations(prev => 
        prev.includes(decoration) 
          ? prev.filter(d => d !== decoration)
          : [...prev, decoration]
      );
    } else if (category === "other") {
      // Toggle decoration in other products decorations array
      setOtherDecorations(prev => 
        prev.includes(decoration) 
          ? prev.filter(d => d !== decoration)
          : [...prev, decoration]
      );
    }
  };

  /**
   * Current Product Configuration Generator
   * Creates a unified product object for preview and order processing
   * Combines universal options with category-specific selections
   * Memoized for performance optimization with complex state dependencies
   * 
   * @returns {Object} - Complete product configuration object with category-specific properties
   */
  const getCurrentProduct = useMemo(() => {
    // Base product properties common to all categories
    const baseProduct = {
      beadType, // Selected bead material
      color // Selected primary color
    };

    // Generate category-specific product configuration
    switch (activeTab) {
      case "purses":
        return {
          ...baseProduct,
          category: "Custom Purse",
          chainType, // Chain/strap material
          decorations: purseDecorations, // Array of selected decorative options
          size: purseSize, // Size category
          image: purseArt // Preview image reference
        };
      case "prayer":
        return {
          ...baseProduct,
          category: "Custom Prayer Beads",
          decorations: prayerDecorations, // Array of decorative enhancements
          beadCount, // Number of beads in sequence
          stringMaterial, // String/cord material
          image: prayerBeads // Preview image reference
        };
      case "others":
        return {
          ...baseProduct,
          category: `Custom ${productType}`, // Dynamic category name based on product type
          productType, // Specific product type (necktie, keychain, etc.)
          decorations: otherDecorations, // Array of decoration options
          material, // Base material selection
          image: necktie // Preview image reference
        };
      default:
        return baseProduct; // Fallback to base configuration
    }
  }, [activeTab, beadType, color, chainType, purseDecorations, purseSize, prayerDecorations, beadCount, stringMaterial, productType, otherDecorations, material]);

  /**
   * Form Validation Logic
   * Determines if the current customization form is complete and ready for submission
   * Validates both universal requirements and category-specific mandatory fields
   * Memoized for efficient re-computation when dependencies change
   * 
   * @returns {boolean} - True if all required fields are filled, false otherwise
   */
  const isFormComplete = useMemo(() => {
    // Universal requirements - must be present for all product types
    const hasCommon = beadType && color;
    
    // Category-specific validation logic
    switch (activeTab) {
      case "purses":
        // Purse requires: universal fields + chain type + size selection
        return hasCommon && chainType && purseSize;
      case "prayer":
        // Prayer beads require: universal fields + bead count + string material
        return hasCommon && beadCount && stringMaterial;
      case "others":
        // Other products require: universal fields + product type + base material
        return hasCommon && productType && material;
      default:
        // Invalid or unrecognized category
        return false;
    }
  }, [activeTab, beadType, color, chainType, purseSize, beadCount, stringMaterial, productType, material]);

  /**
   * WhatsApp Quote Request Handler
   * Generates professional custom order inquiry and sends via WhatsApp Business
   * Creates formatted message with complete specifications and unique order reference
   * Integrates with LaRama's business WhatsApp for direct customer communication
   */
  const handleRequestQuote = () => {
    // Only proceed if all required form fields are completed
    if (isFormComplete) {
      const customProduct = getCurrentProduct; // Get current product configuration
      
      // Generate unique order reference number with timestamp
      const orderRef = `LRM-CUS-${Date.now()}`;
      
      // Create professional WhatsApp message with complete customization details
      const message = `Dear LaRama Team,\n\n` +
        `I would like to request a custom order quote for the following specifications:\n\n` +
        `*Order Reference:* ${orderRef}\n` +
        `*Product Category:* ${activeTab === 'purses' ? 'Handcrafted Custom Purse' : activeTab === 'prayer' ? 'Custom Prayer Beads' : 'Custom Handcrafted Product'}\n\n` +
        `*DETAILED SPECIFICATIONS:*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• Bead Type: ${beadType}\n` +
        `• Color Preference: ${color}\n` +
        // Add category-specific specifications dynamically
        (activeTab === 'purses' ? `• Chain Type: ${chainType}\n• Size Requirements: ${purseSize}\n• Decorative Elements: ${purseDecorations.length > 0 ? purseDecorations.join(', ') : 'Standard'}\n` : '') +
        (activeTab === 'prayer' ? `• Bead Count: ${beadCount} beads\n• String Material: ${stringMaterial}\n• Decorative Elements: ${prayerDecorations.length > 0 ? prayerDecorations.join(', ') : 'Traditional'}\n` : '') +
        (activeTab === 'others' ? `• Product Type: ${productType}\n• Material Preference: ${material}\n• Decorative Elements: ${otherDecorations.length > 0 ? otherDecorations.join(', ') : 'Standard'}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*Estimated Base Price:* ${customProduct.price}\n\n` +
        `Could you please provide:\n` +
        `• Final pricing with customizations\n` +
        `• Estimated completion timeframe\n` +
        `• Available delivery options\n\n` +
        `Thank you for your time and craftsmanship. I look forward to hearing from you.\n\n` +
        `Best regards`;

      // Encode message for URL compatibility and create WhatsApp Business link
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/96171361960?text=${encodedMessage}`;
      
      // Open WhatsApp in new browser tab for customer communication
      window.open(whatsappUrl, '_blank');
      
      // Display confirmation message with order reference for customer records
      alert(`Custom order request sent! Order reference: ${orderRef}\n\nWe'll contact you soon with a quote via WhatsApp.`);
    }
  };

  /**
   * Form Reset Handler
   * Clears all customization selections and returns form to initial state
   * Resets both universal fields and all category-specific options
   * Useful for starting fresh customization or clearing invalid selections
   */
  const resetForm = () => {
    // Reset universal form fields
    setBeadType("");
    setColor("");
    
    // Reset purse-specific fields
    setChainType("");
    setPurseDecorations([]);
    setPurseSize("");
    
    // Reset prayer beads-specific fields
    setPrayerDecorations([]);
    setBeadCount("");
    setStringMaterial("");
    
    // Reset other products-specific fields
    setProductType("");
    setOtherDecorations([]);
    setMaterial("");
  };

  /**
   * Component JSX Return - Main Render Method
   * Renders complete customization interface with theme support
   * Includes hero section, tabbed navigation, and dynamic form sections
   */
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }} className="min-h-screen transition-colors duration-700">
      
      {/* Hero Section - Page Header with Background Image */}
      <section className="relative overflow-hidden">
        {/* Background Image Overlay - Uses purse art with low opacity */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url(${purseArt})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Hero Content - Main page title and description */}
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Customize Your Perfect Piece
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Create a unique handmade piece tailored to your style. Choose from purses, prayer beads, and other beautiful accessories.
          </p>
        </div>
      </section>

      {/* Main Content Container - Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Form Section - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab Navigation Section - Three Main Product Categories */}
            <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
              
              {/* Tab Button Row - Category Selection Interface */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { id: "purses", label: "👜 Purses" },
                  { id: "prayer", label: "🕋 Prayer Beads" },
                  { id: "others", label: "🎀 Others" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id 
                        ? "shadow-lg transform -translate-y-1" // Active tab styling with elevation
                        : "hover:shadow-md" // Hover effect for inactive tabs
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-surface)',
                      color: activeTab === tab.id ? 'white' : 'var(--color-text-primary)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Universal Options Section - Common Properties for All Product Categories */}
            <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                Universal Options
              </h2>
              
              {/* Two-Column Grid Layout for Universal Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bead Type Selection - Material Choice for Beadwork */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Bead Type *
                  </label>
                  <select
                    value={beadType}
                    onChange={(e) => setBeadType(e.target.value)}
                    className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--color-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <option value="">Select bead type...</option>
                    {beadTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Color Selection - Primary Color Choice for All Products */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Color *
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--color-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <option value="">Select color...</option>
                    {colors.map(colorOption => (
                      <option key={colorOption} value={colorOption}>{colorOption}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Purses Customization Section - Conditional Rendering Based on Active Tab */}
            {activeTab === "purses" && (
              <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                  👜 Purse Customization
                </h2>
                
                {/* Purse-Specific Configuration Options */}
                <div className="space-y-6">
                  
                  {/* Chain Type Selection - Handle/Strap Material Choice */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Chain Type *
                    </label>
                    <select
                      value={chainType}
                      onChange={(e) => setChainType(e.target.value)}
                      className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="">Select chain type...</option>
                      {purseOptions.chainTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Decoration Type Selection - Multi-Select Checkboxes for Purse Enhancements */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Decoration Type
                    </label>
                    <div className="space-y-2">
                      {purseOptions.decorationTypes.map(decoration => (
                        <label key={decoration} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={purseDecorations.includes(decoration)}
                            onChange={() => handleDecorationChange(decoration, "purse")}
                            className="mr-2"
                          />
                          <span style={{ color: 'var(--color-text-primary)' }}>{decoration}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection - Purse Dimension Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Size *
                    </label>
                    <select
                      value={purseSize}
                      onChange={(e) => setPurseSize(e.target.value)}
                      className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="">Select size...</option>
                      {purseOptions.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Prayer Beads Customization Section - Religious/Spiritual Beadwork Options */}
            {activeTab === "prayer" && (
              <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                  🕋 Prayer Beads Customization
                </h2>
                
                {/* Prayer Beads-Specific Configuration Options */}
                <div className="space-y-6">
                  
                  {/* Decoration Type Selection - Multi-Select for Spiritual Enhancements */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Decoration Type
                    </label>
                    <div className="space-y-2">
                      {prayerBeadOptions.decorationTypes.map(decoration => (
                        <label key={decoration} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={prayerDecorations.includes(decoration)}
                            onChange={() => handleDecorationChange(decoration, "prayer")}
                            className="mr-2"
                          />
                          <span style={{ color: 'var(--color-text-primary)' }}>{decoration}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bead Count Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Bead Count *
                    </label>
                    <select
                      value={beadCount}
                      onChange={(e) => setBeadCount(e.target.value)}
                      className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="">Select bead count...</option>
                      {prayerBeadOptions.beadCounts.map(count => (
                        <option key={count} value={count}>{count}</option>
                      ))}
                    </select>
                  </div>

                  {/* String Material Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      String Material *
                    </label>
                    <select
                      value={stringMaterial}
                      onChange={(e) => setStringMaterial(e.target.value)}
                      className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="">Select string material...</option>
                      {prayerBeadOptions.stringMaterials.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Others Section */}
            {activeTab === "others" && (
              <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                  🎀 Other Products Customization
                </h2>
                <div className="space-y-6">
                  {/* Product Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Product Type *
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="">Select product type...</option>
                      {otherOptions.productTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Decoration Checkboxes */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Decoration
                    </label>
                    <div className="space-y-2">
                      {otherOptions.decorations.map(decoration => (
                        <label key={decoration} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={otherDecorations.includes(decoration)}
                            onChange={() => handleDecorationChange(decoration, "other")}
                            className="mr-2"
                          />
                          <span style={{ color: 'var(--color-text-primary)' }}>{decoration}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Material Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Material *
                    </label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="">Select material...</option>
                      {otherOptions.materials.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-1">
            <div className="top-8 rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
              <h3 className="text-xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                Live Preview
              </h3>
              
              {getCurrentProduct.image && (
                <div className="rounded-xl overflow-hidden mb-6 border" style={{ borderColor: 'var(--color-border)' }}>
                  <img 
                    src={getCurrentProduct.image} 
                    alt="Product preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="space-y-3 mb-8">
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Product:</span>
                  <p className="font-serif text-lg" style={{ color: 'var(--color-text-primary)' }}>
                    {getCurrentProduct.category || "Select a category"}
                  </p>
                </div>

                {beadType && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Bead Type:</span>
                    <p style={{ color: 'var(--color-text-primary)' }}>{beadType}</p>
                  </div>
                )}

                {color && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Color:</span>
                    <p style={{ color: 'var(--color-text-primary)' }}>{color}</p>
                  </div>
                )}

                {/* Category-specific preview */}
                {activeTab === "purses" && (
                  <>
                    {chainType && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Chain Type:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{chainType}</p>
                      </div>
                    )}
                    {purseDecorations.length > 0 && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Decorations:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{purseDecorations.join(", ")}</p>
                      </div>
                    )}
                    {purseSize && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Size:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{purseSize}</p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "prayer" && (
                  <>
                    {prayerDecorations.length > 0 && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Decorations:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{prayerDecorations.join(", ")}</p>
                      </div>
                    )}
                    {beadCount && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Bead Count:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{beadCount}</p>
                      </div>
                    )}
                    {stringMaterial && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>String Material:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{stringMaterial}</p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "others" && (
                  <>
                    {productType && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Product Type:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{productType}</p>
                      </div>
                    )}
                    {otherDecorations.length > 0 && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Decorations:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{otherDecorations.join(", ")}</p>
                      </div>
                    )}
                    {material && (
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Material:</span>
                        <p style={{ color: 'var(--color-text-primary)' }}>{material}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRequestQuote}
                  disabled={!isFormComplete}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    isFormComplete 
                      ? "hover:shadow-lg transform hover:-translate-y-1" 
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor: isFormComplete ? 'var(--color-accent)' : 'var(--color-border)',
                    color: 'white'
                  }}
                >
                  📱 Request Custom Quote
                </button>
                
                {/* Information Text */}
                <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  🌟 This will open WhatsApp with your custom order details. We'll provide a personalized quote and delivery timeline.
                </p>
                
                <button
                  onClick={resetForm}
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-border)',
                    border: '1px solid'
                  }}
                >
                  Reset Form
                </button>

                <Link
                  to="/products"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-accent)',
                    borderColor: 'var(--color-accent)',
                    border: '1px solid',
                    textDecoration: 'none'
                  }}
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;