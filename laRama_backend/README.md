# LaRama Backend - Setup Instructions

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

The backend is now complete and ready for production use with your React frontend!