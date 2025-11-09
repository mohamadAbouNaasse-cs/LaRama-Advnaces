import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const { isAuthenticated } = useAuth();

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories().catch(() => ({ success: false })) // Categories might not exist yet
        ]);

        if (productsResponse.success) {
          setProducts(productsResponse.data.products || []);
        }

        // Set up basic categories structure
        let categoryList = [{ id: 'all', name: 'All Products' }];
        
        if (categoriesResponse.success && categoriesResponse.data.categories) {
          const backendCategories = categoriesResponse.data.categories.map(cat => ({
            id: cat.category,
            name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1).replace(/([A-Z])/g, ' $1'),
            count: cat.product_count
          }));
          categoryList = [...categoryList, ...backendCategories];
        } else {
          // Fallback to static categories if backend doesn't have any
          categoryList = [
            { id: 'all', name: 'All Products' },
            { id: 'Necklaces', name: 'Necklaces' },
            { id: 'Bracelets', name: 'Bracelets' },
            { id: 'Earrings', name: 'Earrings' },
            { id: 'Anklets', name: 'Anklets' },
          ];
        }
        
        setCategories(categoryList);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Using sample data.');
        
        // Fallback to sample data structure matching backend format
        setProducts([
          {
            id: '1',
            name: 'Handcrafted Beaded Necklace - Blue Ocean',
            description: 'Beautiful blue and white beaded necklace inspired by ocean waves',
            price: 45.99,
            image_url: '/images/necklace-blue-ocean.jpg',
            category: 'Necklaces',
            stock_quantity: 15
          },
          {
            id: '2', 
            name: 'Vintage Style Beaded Bracelet',
            description: 'Elegant vintage-inspired beaded bracelet with gold accents',
            price: 28.50,
            image_url: '/images/bracelet-vintage.jpg',
            category: 'Bracelets',
            stock_quantity: 20
          },
          {
            id: '3',
            name: 'Colorful Beaded Earrings Set',
            description: 'Set of vibrant multicolored beaded earrings',
            price: 22.00,
            image_url: '/images/earrings-colorful.jpg',
            category: 'Earrings',
            stock_quantity: 25
          }
        ]);
        
        setCategories([
          { id: 'all', name: 'All Products' },
          { id: 'Necklaces', name: 'Necklaces' },
          { id: 'Bracelets', name: 'Bracelets' },
          { id: 'Earrings', name: 'Earrings' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await apiService.addToCart(productId, 1);
      if (response.success) {
        alert('Product added to cart successfully!');
      } else {
        alert(response.message || 'Failed to add product to cart');
      }
    } catch (error) {
      alert('Error adding product to cart: ' + error.message);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0YwRTREMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVDNEIzRCI+UHJvZHVjdCBJbWFnZTwvdGV4dD48L3N2Zz4=';

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-[#FAF7F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A299] mx-auto mb-4"></div>
          <p className="text-[#5C4B3D]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Handcrafted Collection</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            Discover LaRama's exquisite handmade creations, each piece crafted with passion and attention to detail.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#D9A299] text-white'
                  : 'bg-[#F0E4D3] text-[#5C4B3D] hover:bg-[#DCC5B2]'
              }`}
            >
              {category.name} {category.count && category.id !== 'all' && `(${category.count})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transition-transform duration-300 hover:shadow-lg"
            >
              <div 
                className="h-72 overflow-hidden relative"
                onClick={() => openProductDetail(product)}
              >
                <img 
                  src={product.image_url || fallbackSvg} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = fallbackSvg;
                    e.target.className = "w-full h-full object-cover";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-[#D9A299] text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2 truncate" onClick={() => openProductDetail(product)}>
                  {product.name}
                </h3>
                <p className="text-[#D9A299] font-bold mb-2">{formatPrice(product.price)}</p>
                <p className="text-xs text-[#8C8A87] mb-3">Stock: {product.stock_quantity}</p>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart[product.id] || product.stock_quantity === 0}
                  className="w-full bg-[#D9A299] hover:bg-[#c18981] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                >
                  {addingToCart[product.id] ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#F0E4D3] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-box-open text-[#D9A299] text-3xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#5C4B3D] mb-2">No products found</h3>
            <p className="text-[#8C8A87]">We couldn't find any products in this category.</p>
          </div>
        )}

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
                      src={selectedProduct.image_url || fallbackSvg} 
                      alt={selectedProduct.name}
                      className="max-w-full max-h-full object-contain p-4"
                      onError={(e) => {
                        e.target.src = fallbackSvg;
                        e.target.className = "w-full h-full object-cover";
                      }}
                    />
                  </div>
                  
                  <div>
                    <p className="text-[#D9A299] font-bold text-2xl mb-4">{formatPrice(selectedProduct.price)}</p>
                    <p className="text-[#5C4B3D] mb-4">{selectedProduct.description}</p>
                    <p className="text-[#5C4B3D] mb-6"><strong>Stock:</strong> {selectedProduct.stock_quantity} available</p>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold text-[#5C4B3D] mb-2">Details</h3>
                      <ul className="text-[#5C4B3D] space-y-1">
                        <li>• Handmade with premium materials</li>
                        <li>• Unique design - no two pieces are identical</li>
                        <li>• Carefully crafted with attention to detail</li>
                        <li>• Includes protective packaging</li>
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleAddToCart(selectedProduct.id)}
                        disabled={addingToCart[selectedProduct.id] || selectedProduct.stock_quantity === 0}
                        className="flex-1 bg-[#D9A299] hover:bg-[#c18981] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                      >
                        {addingToCart[selectedProduct.id] ? 'Adding to Cart...' : selectedProduct.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button className="flex-1 border border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                        Custom Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;