# 🏪 LaRama Handcrafted Products - Backend API

**University of Balamand - Advances in Computer Science**  
**Student:** Mohamad Abou Naasse  
**Project:** E-commerce Platform for LaRama Handcrafted Products  
**Business Owner:** Rama  

---

## 📋 Project Overview

The LaRama Backend is a comprehensive RESTful API built with Node.js and Express.js, designed to power an e-commerce platform for handcrafted products. This backend system provides robust functionality for user authentication, product catalog management, shopping cart operations, order processing, and newsletter subscriptions.

### 🎯 Business Context
LaRama specializes in handcrafted products including decorations, custom neckties, personalized phone cases, prayer items, and handmade purses. This backend system supports the complete e-commerce workflow from product browsing to order fulfillment.

### 🏗️ Architecture & Technology Stack

**Core Technologies:**
- **Runtime:** Node.js (>=16.0.0)
- **Framework:** Express.js 5.1.0
- **Database:** PostgreSQL with connection pooling
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs password hashing, CORS, input validation

**Key Features:**
- 🔐 **Secure Authentication System** with JWT token management
- 🛍️ **Product Catalog Management** with categories and search functionality
- 🛒 **Shopping Cart Operations** with real-time inventory management
- 📦 **Order Processing System** with transaction safety
- 📧 **Newsletter Subscription Management** with analytics
- 🔒 **Comprehensive Security Measures** and input validation
- 💾 **Database Connection Pooling** for optimal performance

---

## 🗂️ System Architecture

### MVC Pattern Implementation

```
├── 📁 config/
│   └── database.js          # PostgreSQL connection pool & configuration
├── 📁 controllers/          # Business Logic Layer
│   ├── authController.js    # User authentication & profile management
│   ├── cartController.js    # Shopping cart operations & inventory management
│   ├── orderController.js   # Order processing & history management
│   ├── productController.js # Product catalog & search functionality
│   └── newsletterController.js # Newsletter subscription & analytics
├── 📁 middleware/           # Security & Validation Layer
│   ├── auth.js             # JWT authentication & authorization
│   └── validation.js       # Input validation & sanitization
├── 📁 routes/              # API Endpoint Layer
│   ├── auth.js            # Authentication endpoints
│   ├── cart.js            # Cart management endpoints
│   ├── orders.js          # Order processing endpoints
│   ├── products.js        # Product catalog endpoints
│   └── newsletter.js      # Newsletter management endpoints
├── 🌐 server.js           # Application entry point & middleware setup
├── 🗄️ database.sql        # Database schema & initial data
└── 📦 package.json        # Dependencies & project configuration
```

### Database Design

The system uses PostgreSQL with optimized connection pooling and includes:
- **Users Table:** Secure user management with hashed passwords
- **Products Table:** Comprehensive product catalog with categories
- **Cart System:** User-specific shopping cart with inventory tracking
- **Orders System:** Complete order history with detailed item tracking
- **Newsletter System:** Subscription management with analytics

---

## 🚀 Quick Start Guide

## 1. Database Setup (Run in pgAdmin4)

1. **Create Database:**
   - Open pgAdmin4
   - Connect to your PostgreSQL server (localhost:5432)
   - Right-click on "Databases" → Create → Database
   - Name: `LaRama_db_advances`
   - Click "Save"

2. **Run Database Schema:**
   - Right-click on the `LaRama_db_advances` database
   - Select "Query Tool"
   - Copy and paste the contents of `database.sql` file
   - Click "Execute" (F5)

## 2. Environment Configuration

1. **Update .env file:**
   - Open `.env` file
   - Update `DB_PASSWORD` with your PostgreSQL password
   - Update other settings as needed:

```env
# Example .env configuration
PORT=5000
NODE_ENV=development

# Database Configuration  
DB_HOST=localhost
DB_PORT=5432
DB_NAME=LaRama_db_advances
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password_here

# JWT Configuration
JWT_SECRET=larama_secret_key_2024_change_in_production
JWT_EXPIRE=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 3. Start the Server

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Or start production server  
npm start
```

## 4. Test the API

### Health Check
```
GET http://localhost:5000/
```

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

### Login User
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Products
```
GET http://localhost:5000/api/products
```

### Add to Cart (Requires Authentication)
```
POST http://localhost:5000/api/cart/add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product_id": "PRODUCT_UUID_FROM_DB",
  "quantity": 2
}
```

## 5. Postman Collection

Import the following endpoints into Postman:

### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user  
- GET `/api/auth/profile` - Get user profile (requires auth)
- GET `/api/auth/verify-token` - Verify JWT token (requires auth)

### Product Endpoints  
- GET `/api/products` - Get all products (with pagination, search, category filter)
- GET `/api/products/categories` - Get all categories
- GET `/api/products/featured` - Get featured products
- GET `/api/products/:id` - Get product by ID

### Cart Endpoints (All require authentication)
- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/items/:cart_item_id` - Update cart item quantity
- DELETE `/api/cart/items/:cart_item_id` - Remove item from cart
- DELETE `/api/cart/clear` - Clear entire cart

---

## 🖼️ Product media backfill script

Existing products in the database can be updated to reference the local frontend assets and correct categories without dropping any data.

1. Ensure your `.env` for the Express app is configured with DB credentials.
2. Run the backfill:

```bash
cd laRama_backend
node scripts/update_product_metadata.js
```

The script updates `image_url`, `category`, ensures `is_active` is set, and fills missing `stock_quantity` values using the mapped inventory counts.

## ✅ Quick verification checklist

- **User shop images:** Hit `GET /api/products` and confirm each product returns `image_url`, `category`, `stock_quantity`, and `is_active` populated so the storefront renders the real images.
- **Admin products:** Use the Nest admin dashboard to create or edit products, including `description`, `category`, `image_url`, `stock_quantity`, and `is_active`. New items should appear on the user site using the provided image path (e.g., `/images/purses/black.jpg`).
- **Order stock decrement:** Place an order from the cart (WhatsApp flow). After confirming, the API creates the order and decrements stock atomically; insufficient stock returns an error without reducing inventory.

### Order Endpoints (All require authentication)
- POST `/api/orders` - Create order from cart
- GET `/api/orders` - Get user orders (with pagination)
- GET `/api/orders/stats` - Get order statistics
- GET `/api/orders/:order_id` - Get specific order details

## 6. Frontend Integration

### Authentication Headers
```javascript
// Add to all authenticated requests
const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Example Frontend Usage
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

// Get products
const getProducts = async (page = 1, category = '', search = '') => {
  const params = new URLSearchParams({ page, category, search });
  const response = await fetch(`http://localhost:5000/api/products?${params}`);
  return await response.json();
};

// Add to cart
const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/cart/add', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product_id: productId, quantity })
  });
  return await response.json();
};
```

## 7. Security Features Implemented

- ✅ JWT Authentication with secure token verification
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention with parameterized queries
- ✅ CORS configuration for frontend integration
- ✅ Proper error handling and logging
- ✅ Transaction support for data consistency
- ✅ Stock management and validation

## 8. Project Structure

```
LaRama_Backend/
├── config/
│   └── database.js          # PostgreSQL connection & configuration
├── controllers/
│   ├── authController.js    # User registration, login, JWT handling
│   ├── cartController.js    # Cart operations (add, remove, update)
│   ├── orderController.js   # Order creation and management
│   └── productController.js # Product catalog operations
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   └── validation.js       # Request validation middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── cart.js            # Cart management routes
│   ├── orders.js          # Order management routes
│   └── products.js        # Product catalog routes
├── .env                   # Environment variables
├── server.js             # Main application entry point
├── database.sql          # Database schema and sample data
├── package.json          # Dependencies and scripts
└── README.md             # This setup guide
```

---

## 🔧 API Documentation Summary

### 🔐 Authentication Endpoints (`/api/auth`)
- **POST** `/register` - User registration with validation
- **POST** `/login` - Secure user authentication with JWT
- **GET** `/profile` - User profile retrieval (authenticated)
- **GET** `/verify-token` - Token validation and renewal

### 🛍️ Product Endpoints (`/api/products`)
- **GET** `/` - Product catalog with pagination, search, and filtering
- **GET** `/categories` - Available product categories
- **GET** `/featured` - Featured products for homepage
- **GET** `/:id` - Detailed product information

### 🛒 Cart Endpoints (`/api/cart`) - All require authentication
- **GET** `/` - User's shopping cart with calculated totals
- **POST** `/add` - Add products to cart with stock validation
- **PUT** `/items/:cart_item_id` - Update item quantities
- **DELETE** `/items/:cart_item_id` - Remove specific items
- **DELETE** `/clear` - Clear entire cart

### 📦 Order Endpoints (`/api/orders`) - All require authentication
- **POST** `/` - Create order from cart with inventory management
- **GET** `/` - Order history with pagination
- **GET** `/stats` - User order statistics and analytics
- **GET** `/:order_id` - Detailed order information

### 📧 Newsletter Endpoints (`/api/newsletter`)
- **POST** `/subscribe` - Newsletter subscription management
- **POST** `/unsubscribe` - Unsubscription handling
- **GET** `/stats` - Subscription analytics (admin)

---

## 🛡️ Security Implementation

### Authentication & Authorization
- **JWT Token Management:** Secure token generation and validation
- **Password Security:** bcryptjs hashing with 12 salt rounds
- **Route Protection:** Middleware-based authentication for secure endpoints
- **Token Expiration:** Configurable token lifetime (24h default)

### Data Protection
- **Input Validation:** Comprehensive request validation using middleware
- **SQL Injection Prevention:** Parameterized queries with pg library
- **CORS Configuration:** Proper cross-origin request handling
- **Error Handling:** Secure error messages without sensitive data exposure

### Database Security
- **Connection Pooling:** Efficient resource management and connection limits
- **Environment Configuration:** Secure credential management via .env
- **Transaction Management:** ACID compliance for data consistency
- **Graceful Shutdown:** Proper connection cleanup on application termination

---

## 📊 Performance Features

### Database Optimization
- **Connection Pooling:** Maximum 20 concurrent connections
- **Query Optimization:** Indexed searches and efficient joins
- **Resource Management:** Automatic cleanup of idle connections
- **Transaction Support:** Atomic operations for data integrity

### API Performance
- **Pagination:** Efficient data loading for large datasets
- **Search Optimization:** Fast product search with multiple criteria
- **Caching Headers:** Appropriate cache control for static resources
- **Error Handling:** Efficient error responses without performance impact

---

## 🎓 Academic Project Information

**University:** University of Balamand  
**Course:** Advances in Computer Science  
**Semester:** Fall 2024  
**Project Type:** E-commerce Platform Development  
**Student:** Mohamad Abou Naasse  
**Submission:** Midterm Project  

### Technical Learning Objectives Achieved
✅ **RESTful API Design** - Complete CRUD operations with proper HTTP methods  
✅ **Database Integration** - PostgreSQL with connection pooling and optimization  
✅ **Authentication Systems** - JWT implementation with security best practices  
✅ **Security Implementation** - Input validation, password hashing, CORS  
✅ **Error Handling** - Comprehensive error management and logging  
✅ **Code Organization** - MVC pattern with clear separation of concerns  
✅ **Documentation** - Professional code documentation and API guides  

### Business Value Delivered
✅ **Complete E-commerce Backend** - Full functionality for online store operations  
✅ **Scalable Architecture** - Designed for growth and future enhancements  
✅ **Security-First Approach** - Production-ready security implementations  
✅ **Performance Optimization** - Efficient database operations and API responses  
✅ **Professional Standards** - Industry-standard coding practices and documentation  

---

## 🔄 Integration with Frontend

This backend is designed to seamlessly integrate with the LaRama React frontend application. The API provides all necessary endpoints for:

- User authentication and session management
- Product catalog browsing and searching
- Shopping cart functionality with real-time updates
- Secure order placement and history tracking
- Newsletter subscription management

### Frontend Connection Example
```javascript
// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('authToken');

// Authenticated request example
const response = await fetch(`${API_BASE_URL}/cart`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🏪 Business Impact

The LaRama Backend empowers Rama's handcrafted products business with:

- **Professional Online Presence** - Enterprise-grade e-commerce functionality
- **Secure Transactions** - Safe customer data and payment processing preparation
- **Inventory Management** - Real-time stock tracking and validation
- **Customer Engagement** - Newsletter and user account management
- **Analytics Ready** - Order statistics and business intelligence foundation
- **Scalability** - Architecture designed for business growth

---

**The LaRama Backend is now complete and ready for production deployment, providing a robust foundation for the handcrafted products e-commerce platform! 🚀**