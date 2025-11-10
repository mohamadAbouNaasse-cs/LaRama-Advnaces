import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Noiré from '../assets/products-images/black-hq.jpg';
import necktie from '../assets/products-images/necktie.jpg';
import prayer from '../assets/products-images/prayer.jpg';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Noiré Purse',
      price: '$60.00',
      image: Noiré,
      category: 'Purses',
      description: 'Handcrafted black purse with intricate beadwork and secure clasp. Perfect for special occasions or as an elegant everyday accessory.',
      details: 'Each bead is carefully hand-stitched using traditional techniques. Features a secure clasp and soft interior lining.'
    },
    {
      id: 2,
      name: 'Handcrafted Beaded Necktie',
      price: '$15.00',
      image: necktie,
      category: 'Neckties',
      description: 'Unique beaded necktie that adds elegance and personality to any outfit. Stand out with this handmade accessory.',
      details: 'Made with high-quality beads and durable threading. Adjustable length to fit most neck sizes. Hand wash only.'
    },
    {
      id: 3,
      name: 'Personalized Prayer Beads',
      price: '$8.00',
      image: prayer,
      category: 'Prayer Beads',
      description: 'Beautifully crafted prayer beads for meditation and spiritual practice. Can be personalized with different colors.',
      details: 'Available in various colors and bead materials. Each set comes with a decorative tassel. Approximately 33 beads per strand.'
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product, event) => {
    // Prevent opening the product detail modal
    event.stopPropagation();
    
    if (!isAuthenticated) {
      const shouldRedirect = confirm(
        `Please sign in to add items to your cart.\n\nWould you like to go to the login page now?`
      );
      if (shouldRedirect) {
        navigate('/auth', { 
          state: { from: { pathname: '/' } }
        });
      }
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      // For hardcoded products, we need to find matching products in the database
      // or create a temporary cart item for demonstration
      const response = await apiService.getProducts();
      
      if (response.success && response.data && response.data.products) {
        // Try to find a matching product by name similarity
        const products = response.data.products;
        let matchedProduct = null;
        
        // Simple name matching logic
        if (product.name.includes('Noiré') || product.name.includes('Purse')) {
          matchedProduct = products.find(p => p.name.toLowerCase().includes('purse') || p.name.toLowerCase().includes('bag'));
        } else if (product.name.includes('Necktie')) {
          matchedProduct = products.find(p => p.name.toLowerCase().includes('necktie') || p.name.toLowerCase().includes('tie'));
        } else if (product.name.includes('Prayer')) {
          matchedProduct = products.find(p => p.name.toLowerCase().includes('prayer') || p.name.toLowerCase().includes('beads'));
        }
        
        if (matchedProduct) {
          const addResponse = await apiService.addToCart(matchedProduct.id, 1);
          if (addResponse.success) {
            alert(`✅ ${product.name} added to cart successfully!`);
          } else {
            alert(addResponse.message || 'Failed to add product to cart');
          }
        } else {
          // If no matching product found, show a message
          alert(`📝 ${product.name} is currently being added to our inventory. Please contact us directly for this item!`);
        }
      } else {
        alert('Unable to access product catalog. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Error adding product to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await apiService.subscribeNewsletter(email.trim(), 'home');
      
      if (response.success) {
        setIsSubscribed(true);
        setEmail('');
        
        // Show success message based on response type
        if (response.already_subscribed) {
          console.log('Already subscribed to newsletter');
        } else if (response.reactivated) {
          console.log('Newsletter subscription reactivated');
        } else {
          console.log('Successfully subscribed to newsletter');
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        alert(response.message || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Failed to subscribe to newsletter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-[#F0E4D3] bg-opacity-70 flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#5C4B3D] mb-6">
            Exquisite Handmade Beadwork
          </h1>
          <p className="text-xl text-[#5C4B3D] mb-10 max-w-2xl mx-auto">
            Discover unique, hand-beaded treasures—from elegant purses to personalized prayer beads, each piece tells its own story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="inline-block bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
            >
              Shop Collection
            </Link>
            <Link 
              to="/customize" 
              className="inline-block border-2 border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-[#FAF7F3] font-semibold py-3 px-8 rounded-full transition-colors duration-300"
            >
              Design Custom Item
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#FAF7F3]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-[#5C4B3D] mb-4">Featured Creations</h2>
          <p className="text-center text-[#8C8A87] mb-12 max-w-2xl mx-auto">
            Each piece is meticulously handcrafted with attention to detail and quality materials.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group text-center">
                <div className="overflow-hidden rounded-lg mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-130 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm text-[#D9A299] font-medium">{product.category}</span>
                <h3 className="font-serif text-xl text-[#5C4B3D] mb-2 mt-1">{product.name}</h3>
                <p className="text-[#5C4B3D] font-semibold mb-4">{product.price}</p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={(event) => handleAddToCart(product, event)}
                    disabled={addingToCart[product.id]}
                    className="bg-[#D9A299] hover:bg-[#c18981] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
                  >
                    {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => openProductDetail(product)}
                    className="border border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-[#FAF7F3] py-2 px-6 rounded-full transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-block border-2 border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-[#FAF7F3] font-semibold py-3 px-8 rounded-full transition-colors duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#5C4B3D]">{selectedProduct.name}</h2>
                <button 
                  onClick={closeProductDetail}
                  className="text-[#5C4B3D] hover:text-[#D9A299] text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96 rounded-lg overflow-hidden bg-[#FAF7F3] flex items-center justify-center">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="max-w-full max-h-full object-contain p-4"
                  />
                </div>
                
                <div>
                  <span className="text-sm text-[#D9A299] font-medium">{selectedProduct.category}</span>
                  <p className="text-[#D9A299] font-bold text-2xl mb-4">{selectedProduct.price}</p>
                  <p className="text-[#5C4B3D] mb-4">{selectedProduct.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#5C4B3D] mb-2">Details</h3>
                    <p className="text-[#5C4B3D]">{selectedProduct.details}</p>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={(event) => handleAddToCart(selectedProduct, event)}
                      disabled={addingToCart[selectedProduct.id]}
                      className="flex-1 bg-[#D9A299] hover:bg-[#c18981] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                    >
                      {addingToCart[selectedProduct.id] ? 'Adding to Cart...' : 'Add to Cart'}
                    </button>
                    <Link 
                      to="/customize" 
                      className="flex-1 border border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                    >
                      Custom Order
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16 px-4 bg-[#F0E4D3]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-6">Create Your Unique Piece</h2>
          <p className="text-lg text-[#5C4B3D] mb-8 max-w-2xl mx-auto">
            Our custom design tool lets you create one-of-a-kind beadwork items tailored to your preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#FAF7F3] p-6 rounded-lg">
              <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">1</span>
              </div>
              <h3 className="font-serif text-xl text-[#5C4B3D] mb-2">Choose Your Item</h3>
              <p className="text-[#5C4B3D]">Select from purses, neckties, prayer beads, and more.</p>
            </div>
            <div className="bg-[#FAF7F3] p-6 rounded-lg">
              <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">2</span>
              </div>
              <h3 className="font-serif text-xl text-[#5C4B3D] mb-2">Select Materials</h3>
              <p className="text-[#5C4B3D]">Pick from various bead types, colors, and decorations.</p>
            </div>
            <div className="bg-[#FAF7F3] p-6 rounded-lg">
              <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">3</span>
              </div>
              <h3 className="font-serif text-xl text-[#5C4B3D] mb-2">Preview & Order</h3>
              <p className="text-[#5C4B3D]">See your creation and place your custom order.</p>
            </div>
          </div>
          <Link 
            to="/customize" 
            className="inline-block bg-[#5C4B3D] hover:bg-[#4a3c30] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
          >
            Start Designing
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#FAF7F3]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-6">Our Craftsmanship</h2>
            <div className="prose prose-lg text-[#5C4B3D] mx-auto">
              <p>
                LaRama began with a passion for the ancient art of beadwork, combining traditional techniques 
                with contemporary designs. Each piece is meticulously crafted by hand, ensuring unique 
                characteristics and exceptional quality.
              </p>
              <p>
                We source high-quality materials from ethical suppliers and take pride in creating pieces 
                that become cherished possessions. From delicate glass beads to polished stones, every 
                element is chosen with intention and care.
              </p>
            </div>
            <Link 
              to="/about" 
              className="inline-block mt-8 text-[#5C4B3D] hover:text-[#D9A299] font-semibold transition-colors duration-300"
            >
              Learn more about our techniques →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F0E4D3]">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-4">Join Our Community</h2>
          <p className="text-[#5C4B3D] mb-8">
            Be the first to know about new collections, beadwork workshops, and special offers.
          </p>
          
          {isSubscribed ? (
            <div className="bg-[#D9A299] text-white p-4 rounded-lg animate-pulse">
              <i className="fas fa-check-circle mr-2"></i>
              Thank you for subscribing! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-start">
              <input 
                type="email" 
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-full border border-[#DCC5B2] focus:outline-none focus:ring-2 focus:ring-[#D9A299] min-w-0 flex-grow"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#5C4B3D] hover:bg-[#4a3c30] disabled:bg-[#8C8A87] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md flex items-center"
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
          
          <p className="text-sm text-[#5C4B3D] mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;