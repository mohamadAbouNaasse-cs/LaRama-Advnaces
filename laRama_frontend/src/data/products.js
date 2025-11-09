// Product data compatible with backend structure

// This file can be used to seed the database or as fallback data

export const sampleProducts = [
  {
    name: 'Handcrafted Beaded Necklace - Blue Ocean',
    description: 'Beautiful blue and white beaded necklace inspired by ocean waves. Each piece is meticulously crafted with premium glass beads and features a unique pattern that captures the essence of ocean serenity.',
    price: 45.99,
    image_url: '/images/necklaces/blue-ocean.jpg',
    category: 'Necklaces',
    stock_quantity: 15
  },
  {
    name: 'Vintage Style Beaded Bracelet',
    description: 'Elegant vintage-inspired beaded bracelet with gold accents. This timeless piece combines traditional beadwork techniques with modern design sensibilities.',
    price: 28.50,
    image_url: '/images/bracelets/vintage.jpg', 
    category: 'Bracelets',
    stock_quantity: 20
  },
  {
    name: 'Colorful Beaded Earrings Set',
    description: 'Set of vibrant multicolored beaded earrings that add a splash of color to any outfit. Lightweight and comfortable for all-day wear.',
    price: 22.00,
    image_url: '/images/earrings/colorful.jpg',
    category: 'Earrings', 
    stock_quantity: 25
  },
  {
    name: 'Bohemian Beaded Anklet',
    description: 'Boho-style beaded anklet with natural stones and earth-tone beads. Perfect for summer outfits and beach occasions.',
    price: 18.75,
    image_url: '/images/anklets/bohemian.jpg',
    category: 'Anklets',
    stock_quantity: 12
  },
  {
    name: 'Luxury Pearl & Bead Necklace',
    description: 'Sophisticated combination of pearls and glass beads creating an elegant statement piece. Perfect for special occasions and formal events.',
    price: 89.99,
    image_url: '/images/necklaces/pearl-luxury.jpg',
    category: 'Necklaces',
    stock_quantity: 8
  },
  {
    name: 'Artisan Beaded Ring Set',
    description: 'Handcrafted set of three delicate beaded rings that can be worn together or separately. Features intricate beadwork patterns.',
    price: 35.00,
    image_url: '/images/rings/artisan-set.jpg',
    category: 'Rings',
    stock_quantity: 18
  },
  {
    name: 'Traditional Prayer Beads',
    description: 'Beautifully crafted prayer beads for meditation and spiritual practice. Made with natural wood and features traditional design.',
    price: 24.99,
    image_url: '/images/prayer/traditional.jpg',
    category: 'Spiritual',
    stock_quantity: 30
  },
  {
    name: 'Crystal Healing Bracelet',
    description: 'Energy healing bracelet featuring natural crystals and semi-precious stones. Each stone is carefully selected for its healing properties.',
    price: 42.00,
    image_url: '/images/bracelets/crystal-healing.jpg',
    category: 'Bracelets',
    stock_quantity: 15
  }
];

export const categories = [
  'Necklaces',
  'Bracelets', 
  'Earrings',
  'Anklets',
  'Rings',
  'Spiritual'
];

export default sampleProducts;