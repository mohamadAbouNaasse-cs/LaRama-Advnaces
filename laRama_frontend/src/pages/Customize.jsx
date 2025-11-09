import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import purseArt from "../assets/products-images/white-snow.jpg";
import necktie from "../assets/products-images/necktie.jpg";
import prayerBeads from "../assets/products-images/prayer.jpg";

// Common options across all categories as specified in your requirements
const beadTypes = ["Glass", "Seed", "Wooden", "Stone", "Crystal", "Clay", "Metal", "Acrylic"];
const colors = ["Red", "Blue", "Green", "Black", "White", "Gold", "Silver", "Pink", "Brown", "Transparent"];

// Category-specific options exactly as requested
const purseOptions = {
  chainTypes: ["Metal", "Fabric", "None"],
  decorationTypes: ["Crystals", "Embroidery", "Mixed Materials"],
  sizes: ["Small", "Medium", "Large"]
};

const prayerBeadOptions = {
  decorationTypes: ["Tassel", "Charm", "Plain"],
  beadCounts: ["33", "66", "99"],
  stringMaterials: ["Nylon", "Silk", "Elastic"]
};

const otherOptions = {
  productTypes: ["Tie", "Bracelet", "Keychain", "Necklace"],
  decorations: ["Bead Pattern", "Embroidery", "None"],
  materials: ["Fabric", "Wood", "Mixed"]
};

const Customize = () => {
  const [activeTab, setActiveTab] = useState("purses");
  
  // Common form state
  const [beadType, setBeadType] = useState("");
  const [color, setColor] = useState("");
  
  // Purse-specific state
  const [chainType, setChainType] = useState("");
  const [purseDecorations, setPurseDecorations] = useState([]);
  const [purseSize, setPurseSize] = useState("");
  
  // Prayer beads-specific state
  const [prayerDecorations, setPrayerDecorations] = useState([]);
  const [beadCount, setBeadCount] = useState("");
  const [stringMaterial, setStringMaterial] = useState("");
  
  // Others-specific state
  const [productType, setProductType] = useState("");
  const [otherDecorations, setOtherDecorations] = useState([]);
  const [material, setMaterial] = useState("");

  // Handle checkbox changes for decorations
  const handleDecorationChange = (decoration, category) => {
    if (category === "purse") {
      setPurseDecorations(prev => 
        prev.includes(decoration) 
          ? prev.filter(d => d !== decoration)
          : [...prev, decoration]
      );
    } else if (category === "prayer") {
      setPrayerDecorations(prev => 
        prev.includes(decoration) 
          ? prev.filter(d => d !== decoration)
          : [...prev, decoration]
      );
    } else if (category === "other") {
      setOtherDecorations(prev => 
        prev.includes(decoration) 
          ? prev.filter(d => d !== decoration)
          : [...prev, decoration]
      );
    }
  };

  // Get current product details for preview
  const getCurrentProduct = useMemo(() => {
    const baseProduct = {
      beadType,
      color
    };

    switch (activeTab) {
      case "purses":
        return {
          ...baseProduct,
          category: "Custom Purse",
          chainType,
          decorations: purseDecorations,
          size: purseSize,
          image: purseArt
        };
      case "prayer":
        return {
          ...baseProduct,
          category: "Custom Prayer Beads",
          decorations: prayerDecorations,
          beadCount,
          stringMaterial,
          image: prayerBeads
        };
      case "others":
        return {
          ...baseProduct,
          category: `Custom ${productType}`,
          productType,
          decorations: otherDecorations,
          material,
          image: necktie
        };
      default:
        return baseProduct;
    }
  }, [activeTab, beadType, color, chainType, purseDecorations, purseSize, prayerDecorations, beadCount, stringMaterial, productType, otherDecorations, material]);

  // Check if form is complete
  const isFormComplete = useMemo(() => {
    const hasCommon = beadType && color;
    
    switch (activeTab) {
      case "purses":
        return hasCommon && chainType && purseSize;
      case "prayer":
        return hasCommon && beadCount && stringMaterial;
      case "others":
        return hasCommon && productType && material;
      default:
        return false;
    }
  }, [activeTab, beadType, color, chainType, purseSize, beadCount, stringMaterial, productType, material]);

  const handleAddToCart = () => {
    if (isFormComplete) {
      const customProduct = getCurrentProduct;
      console.log("Adding to cart:", customProduct);
      // Here you would integrate with your cart context/state management
      alert("Custom product added to cart!");
    }
  };

  const resetForm = () => {
    setBeadType("");
    setColor("");
    setChainType("");
    setPurseDecorations([]);
    setPurseSize("");
    setPrayerDecorations([]);
    setBeadCount("");
    setStringMaterial("");
    setProductType("");
    setOtherDecorations([]);
    setMaterial("");
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }} className="min-h-screen transition-colors duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url(${purseArt})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Customize Your Perfect Piece
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Create a unique handmade piece tailored to your style. Choose from purses, prayer beads, and other beautiful accessories.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab Navigation - Three main sections as requested */}
            <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
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
                        ? "shadow-lg transform -translate-y-1" 
                        : "hover:shadow-md"
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

            {/* Common Options Section - Universal properties as specified */}
            <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                Universal Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bead Type Dropdown */}
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

                {/* Color Dropdown */}
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

            {/* Purses Section */}
            {activeTab === "purses" && (
              <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                  👜 Purse Customization
                </h2>
                <div className="space-y-6">
                  {/* Chain Type Dropdown */}
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

                  {/* Decoration Type Checkboxes */}
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

                  {/* Size Dropdown */}
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

            {/* Prayer Beads Section */}
            {activeTab === "prayer" && (
              <div className="rounded-3xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                  🕋 Prayer Beads Customization
                </h2>
                <div className="space-y-6">
                  {/* Decoration Type Checkboxes */}
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
                  onClick={handleAddToCart}
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
                  Add to Cart
                </button>
                
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