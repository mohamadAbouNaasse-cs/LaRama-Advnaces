import { useState } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: 'Şık 🖤', category: 'purses', price: '$50.00', image: '/images/purses/black.jpg', description: 'Şık embodies effortless style. Its sleek lines and refined details whisper confidence, turning every glance into admiration. More than an accessory—it’s elegance you can carry. ✨🖤' },
    { id: 2, name: 'Noiré', category: 'purses', price: '$45.00', image: '/images/purses/black-hq.jpg', description: 'Noiré is the essence of timeless elegance. Its black beads mirror midnight skies, while golden details whisper luxury. A bag for women who carry mystery with confidence. 🖤🌙✨' },
    { id: 3, name: 'Şık #2 🖤', category: 'purses', price: '$50.00', image: '/images/purses/black-s.jpg', description: 'Şık embodies effortless style. Its sleek lines and refined details whisper confidence, turning every glance into admiration. More than an accessory—it’s elegance you can carry. ✨🖤' },
    { id: 4, name: 'Aurora 🌸', category: 'purses', price: '$30.00', image: '/images/purses/fa5ame.jpg', description: 'Aurora is a bag born from dawn’s first light, where pastel pearls capture the glow of a new beginning. It carries elegance with every touch, like a secret whispered by the morning sky. 🌸✨' },
    { id: 5, name: 'Prisma', category: 'purses', price: '$25.00', image: '/images/purses/kid.jpg', description: 'Prisma bursts with the joy of every hue, a playful dance of crystal beads that catch the light from every angle. It’s the bag that turns any outing into a celebration of color and sparkle.🎨🌟' },
    { id: 6, name: 'CoffeeGrace 🤎✨', category: 'purses', price: '$30.00', image: '/images/purses/rama1.jpg', description: 'Coffee Grace is elegance stirred with warmth. Its beaded texture and pearl accents reflect refined taste, perfect for moments where charm meets confidence.' },
    { id: 7, name: 'Lumière ♥', category: 'purses', price: '$60.00', image: '/images/purses/red.jpg', description: 'Lumière ignites every look with fearless glamour. Its crimson crystals catch the light like tiny flames, made for nights when confidence steals the spotlight. 🔥' },
    { id: 8, name: 'Pearleva', category: 'purses', price: '$45.00', image: '/images/purses/white-snow.jpg', description: 'Pearleva embodies pure sophistication. Layers of luminous pearls reflect quiet luxury, making every occasion feel timeless and effortlessly elegant. 🕊💫' },
    { id: 9, name: 'Terra L🌿', category: 'purses', price: '$60.00', image: '/images/purses/wood-s.jpg', description: 'Terra is crafted from nature’s essence, where every wooden bead tells a story of earth and warmth. A bag made for free spirits who carry sunshine and simplicity with them. 🌞🌿' },
    { id: 10, name: 'Terra S🌿', category: 'purses', price: '$50.00', image: '/images/purses/wood-b.jpg', description: 'Terra is crafted from nature’s essence, where every wooden bead tells a story of earth and warmth. A bag made for free spirits who carry sunshine and simplicity with them. 🌞🌿' },
    { id: 11, name: 'Terra Bunndle🌿', category: 'purses', price: '$99.99', image: '/images/purses/wood2.jpg', description: 'Terra is crafted from nature’s essence, where every wooden bead tells a story of earth and warmth. A bag made for free spirits who carry sunshine and simplicity with them. 🌞🌿' },
    
    { id: 12, name: 'D Letter Decoration', category: 'decorations', price: '$10.00', image: '/images/decorations/D-letter.jpg', description: 'Elegant beaded letter D, perfect for home decor or gifts.' },
    { id: 13, name: 'RDO Letters Set', category: 'decorations', price: '$25.00', image: '/images/decorations/RDO-letters.jpg', description: 'Complete set of R, D, and O letters for custom displays.' },
    { id: 14, name: 'R Letter Art', category: 'decorations', price: '$10.00', image: '/images/decorations/R-letter.jpg', description: 'Standalone R letter crafted with precision and style.' },
    { id: 15, name: 'RO Letters Pair', category: 'decorations', price: '$20.00', image: '/images/decorations/RO-letters.jpg', description: 'Beautiful R and O letter set for various decorative purposes.' },
    
    { id: 17, name: 'Handmade Beaded Necktie', category: 'neckties', price: '$15.00', image: '/images/nektie/necktie.jpg', description: 'Unique beaded necktie that adds elegance to any outfit.' },
    
    { id: 18, name: 'Traditional Prayer Beads', category: 'prayer', price: '$8.00', image: '/images/prayer/prayer.jpg', description: 'Beautifully crafted prayer beads for meditation and spiritual practice.' },
    { id: 19, name: 'Midnight Serenity Beads', category: 'prayer', price: '$8.00', image: '/images/prayer/black-prayerBead.jpg', description: 'Immerse in quiet reflection with Midnight Serenity, a hand-crafted black prayer bead strand symbolizing protection and calm energy.' },
    { id: 20, name: 'Emerald Tranquility Beads', category: 'prayer', price: '$8.00',image: '/images/prayer/green-prayerBead.jpg', description: 'Find peace with Emerald Tranquility, a hand-crafted green prayer bead strand that embodies balance and healing energy.' },

    { id: 21, name: 'Pearleva 2', category: 'phone-case', price: '$30.00', image: '/images/phone-case/phone-case.jpg', description: 'Pearleva embodies pure sophistication. Layers of luminous pearls reflect quiet luxury, making every occasion feel timeless and effortlessly elegant. 🕊💫' },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'purses', name: 'Purses' },
    { id: 'decorations', name: 'Letters & Decorations' },
    { id: 'neckties', name: 'Neckties' },
    { id: 'prayer', name: 'Prayer Beads' },
    { id: 'phone-case', name: 'Phone Cases' },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0YwRTREMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVDNEIzRCI+UHJvZHVjdCBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Handcrafted Collection</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            Discover Rama's exquisite handmade creations, each piece crafted with passion and attention to detail.
          </p>
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
              {category.name}
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
          src={product.image} 
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
      <div className="p-4" onClick={() => openProductDetail(product)}>
        <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2 truncate">{product.name}</h3>
        <p className="text-[#D9A299] font-bold">{product.price}</p>
      </div>
    </div>
  ))}
</div>


        {filteredProducts.length === 0 && (
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
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="max-w-full max-h-full object-contain p-4"
                      onError={(e) => {
                        e.target.src = fallbackSvg;
                        e.target.className = "w-full h-full object-cover";
                      }}
                    />
                  </div>
                  
                  <div>
                    <p className="text-[#D9A299] font-bold text-2xl mb-4">{selectedProduct.price}</p>
                    <p className="text-[#5C4B3D] mb-6">{selectedProduct.description}</p>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold text-[#5C4B3D] mb-2">Details</h3>
                      <ul className="text-[#5C4B3D] space-y-1">
                        <li>• Handmade with premium materials</li>
                        <li>• Unique design - no two pieces are identical</li>
                        <li>• Carefully crafted in Lebanon</li>
                        <li>• Includes protective packaging</li>
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <button className="flex-1 bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                        Add to Cart
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