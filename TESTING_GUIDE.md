# LaRama E-commerce Testing Guide 🧪

## Prerequisites ✅

Before testing, ensure you have:

### Software Requirements
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Git** (for version control)
- **Code Editor** (VS Code recommended)

### Database Setup
1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE LaRama_db_advances;
   ```

2. Run the database schema:
   ```bash
   # Connect to your PostgreSQL database and run:
   psql -U postgres -d LaRama_db_advances -f laRama_backend/database.sql
   ```

## Backend Setup & Testing 🚀

### 1. Environment Configuration

```bash
cd laRama_backend
```

Create `.env` file (copy from `.env.example`):
```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=LaRama_db_advances
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration (IMPORTANT: Change in production)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_at_least_32_chars_long
JWT_EXPIRE=24h
```

### 2. Install Dependencies & Start Server

```bash
npm install
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
🚀 LaRama Backend Server Started Successfully!
📡 Server running on port 5000
🌍 Environment: development
📊 Database: LaRama_db_advances
🔗 API Base URL: http://localhost:5000
🎯 Frontend URL: http://localhost:5173
```

### 3. Backend API Testing

#### Test 1: Health Check
```bash
curl http://localhost:5000
```
**Expected Response:**
```json
{
  "success": true,
  "message": "LaRama Backend API is running",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products", 
    "cart": "/api/cart",
    "orders": "/api/orders"
  }
}
```

#### Test 2: User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "Test User",
      "email": "test@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

#### Test 3: User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test 4: Get Products
```bash
curl http://localhost:5000/api/products
```

#### Test 5: Protected Route (Replace TOKEN with actual token)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Frontend Setup & Testing 🎨

### 1. Environment Configuration

```bash
cd laRama_frontend
```

Create `.env` file (copy from `.env.example`):
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=LaRama
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies & Start Development Server

```bash
npm install
npm run dev
```

**Expected Output:**
```
VITE v7.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Full Stack Testing Scenarios 🔄

### Scenario 1: Complete User Journey

1. **Open Frontend**: Navigate to `http://localhost:5173`
2. **Registration Flow**:
   - Click "Auth" or try to access cart/dashboard
   - Switch to "Sign Up" tab
   - Fill form: Name, Email, Password (min 6 chars)
   - Submit → Should redirect to dashboard
3. **Authentication Verification**:
   - Check browser storage for auth token
   - Refresh page → Should remain logged in
   - Visit protected routes → Should work

### Scenario 2: Product Management

1. **View Products**: Navigate to `/products`
2. **API Integration Check**:
   - Products should load from backend
   - Categories should be dynamic
   - Product details should open in modal
3. **Add to Cart** (requires login):
   - Click "Add to Cart" on any product
   - Should see success message
   - Cart count should update (if implemented in header)

### Scenario 3: Cart Management

1. **View Cart**: Navigate to `/cart` (must be logged in)
2. **Cart Operations**:
   - Should show items from backend
   - Quantity updates should work
   - Remove items should work
   - Total calculations should be accurate

### Scenario 4: Error Handling

1. **Backend Offline**: Stop backend server
2. **Frontend Behavior**:
   - Should show fallback data for products
   - Auth operations should show error messages
   - Cart should show loading/error states

## Database Verification 📊

Check data persistence:

```sql
-- Check users
SELECT id, name, email, created_at FROM users;

-- Check products  
SELECT id, name, price, category, stock_quantity FROM products;

-- Check carts and cart items
SELECT c.id, c.user_id, ci.product_id, ci.quantity 
FROM carts c 
LEFT JOIN cart_items ci ON c.id = ci.cart_id;
```

## Common Issues & Solutions 🔧

### Issue 1: Database Connection Error
```
❌ Database connection error: password authentication failed
```
**Solution**: Check your PostgreSQL credentials in `.env`

### Issue 2: CORS Error in Browser
```
Access to fetch at 'http://localhost:5000' blocked by CORS
```  
**Solution**: Ensure backend CORS is configured for frontend URL

### Issue 3: JWT Token Invalid
```
Invalid token
```
**Solution**: Check JWT_SECRET matches between requests, token not expired

### Issue 4: Products Not Loading
```
Failed to load products
```
**Solution**: 
1. Ensure database has sample products
2. Check API endpoint accessibility
3. Verify backend is running

## Performance Testing 📈

### Load Testing (Optional)
Use tools like Apache Bench or Postman:

```bash
# Test product endpoint
ab -n 100 -c 10 http://localhost:5000/api/products

# Expected: All requests should complete successfully
```

## Security Testing 🔒

### Test Authentication
1. Try accessing protected routes without token → Should return 401
2. Try using expired/invalid token → Should return 403  
3. Try SQL injection in login → Should be prevented
4. Check password hashing → Passwords should be bcrypt hashed

## API Documentation 📚

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/verify` - Verify token (protected)

### Product Endpoints  
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get product categories
- `GET /api/products/featured` - Get featured products

### Cart Endpoints (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

### Frontend Routes
- `/` - Home page
- `/products` - Products catalog
- `/auth` - Login/Register
- `/cart` - Shopping cart (protected)
- `/dashboard` - User dashboard (protected)

## Success Criteria ✨

Your setup is successful when:

- ✅ Backend starts without errors
- ✅ Database connection established  
- ✅ Frontend loads and displays properly
- ✅ User can register/login successfully
- ✅ Products load from backend
- ✅ Add to cart functionality works
- ✅ Cart displays items correctly
- ✅ Authentication persists across page refreshes
- ✅ Protected routes work correctly
- ✅ Error handling displays user-friendly messages

## Next Steps 🚧

After successful testing, consider implementing:

1. **Order Management System**
2. **Payment Integration**  
3. **Product Image Upload**
4. **Admin Dashboard**
5. **Email Notifications**
6. **Product Reviews System**
7. **Inventory Management**
8. **Advanced Search & Filtering**

---

## Support 💬

If you encounter issues:

1. Check console logs (browser & terminal)
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database connection and data
5. Verify API endpoints are responding

**Happy Testing! 🎉**