require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LaRama Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      newsletter: '/api/newsletter'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requested_path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log('\n🚀 LaRama Backend Server Started Successfully!');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: ${process.env.DB_NAME}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log('\n📋 Available Endpoints:');
      console.log('   GET  / - Health check');
      console.log('   POST /api/auth/register - Register user');
      console.log('   POST /api/auth/login - Login user');
      console.log('   GET  /api/auth/profile - Get user profile');
      console.log('   GET  /api/products - Get all products');
      console.log('   GET  /api/products/categories - Get categories');
      console.log('   GET  /api/products/featured - Get featured products');
      console.log('   GET  /api/products/:id - Get product by ID');
      console.log('   GET  /api/cart - Get user cart');
      console.log('   POST /api/cart/add - Add item to cart');
      console.log('   PUT  /api/cart/items/:id - Update cart item');
      console.log('   DEL  /api/cart/items/:id - Remove cart item');
      console.log('   POST /api/orders - Create order');
      console.log('   GET  /api/orders - Get user orders');
      console.log('   GET  /api/orders/:id - Get order details');
      console.log('   POST /api/newsletter/subscribe - Subscribe to newsletter');
      console.log('   POST /api/newsletter/unsubscribe - Unsubscribe from newsletter');
      console.log('   GET  /api/newsletter/stats - Get newsletter statistics');
      console.log('\n✨ Ready to receive requests!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();