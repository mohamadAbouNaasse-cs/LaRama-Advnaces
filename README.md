# 🌟 LaRama Handcrafted - E-commerce Platform

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC.svg)](https://tailwindcss.com/)

> **A comprehensive e-commerce platform for handmade beadwork products featuring custom design tools, secure authentication, and WhatsApp integration.**

---

## 📖 Table of Contents

- [🌟 LaRama Handcrafted - E-commerce Platform](#-larama-handcrafted---e-commerce-platform)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Project Overview](#-project-overview)
  - [✨ Key Features](#-key-features)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [📁 Project Structure](#-project-structure)
  - [⚡ Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
    - [Database Setup](#database-setup)
    - [Running the Application](#running-the-application)
  - [🎯 Core Functionality](#-core-functionality)
  - [🔧 API Endpoints](#-api-endpoints)
  - [🎨 Frontend Architecture](#-frontend-architecture)
  - [🗄️ Database Schema](#️-database-schema)
  - [🔐 Authentication System](#-authentication-system)
  - [📱 Responsive Design](#-responsive-design)
  - [🌙 Theme System](#-theme-system)
  - [📧 Newsletter Integration](#-newsletter-integration)
  - [📞 WhatsApp Business Integration](#-whatsapp-business-integration)
  - [🚀 Deployment](#-deployment)
  - [🧪 Testing](#-testing)
  - [📚 Documentation](#-documentation)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [👥 Team](#-team)
  - [📞 Support](#-support)

---

## 🚀 Project Overview

**LaRama Handcrafted** is a modern, full-stack e-commerce platform specifically designed for artisan beadwork products. Developed as an academic project at University of Balamand for the Advances in Computer Science course, it showcases the perfect blend of traditional family craftsmanship and cutting-edge web technology, supporting the real LaRama handcrafted business owned by Rama.

### 🎯 Mission
To provide a seamless digital shopping experience for handmade beadwork enthusiasts while empowering artisans with powerful customization tools and direct customer communication channels.

### 🌍 Market Focus
- **Primary Market**: Lebanon and MENA region
- **Target Audience**: Fashion enthusiasts, gift seekers, spiritual product customers
- **Product Categories**: Purses, Prayer Beads, Decorative Items, Custom Accessories

---

## ✨ Key Features

### 🛍️ **E-commerce Core**
- **Product Catalog**: Dynamic product browsing with category filtering
- **Shopping Cart**: Persistent cart with quantity management
- **Secure Checkout**: JWT-based authentication and session management
- **Order Tracking**: Real-time order status updates

### 🎨 **Customization Engine**
- **Interactive Design Tool**: 3-category customization system (Purses, Prayer Beads, Others)
- **Real-time Preview**: Live product visualization with selected options
- **Material Selection**: Comprehensive bead types, colors, and finishing options
- **Price Calculator**: Dynamic pricing based on customization choices

### 💬 **Communication Features**
- **WhatsApp Integration**: Direct customer communication with formatted order details
- **Newsletter System**: Email subscription with preference management
- **Contact Forms**: Multi-channel customer support system

### 🔒 **Security & Performance**
- **JWT Authentication**: Secure user sessions with token refresh
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Graceful error management with user feedback
- **Responsive Design**: Mobile-first approach with cross-device compatibility

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 19.1.1 with Hooks and Context API
- **Build Tool**: Vite 7.1.2 for lightning-fast development
- **Styling**: Tailwind CSS 4.1.12 with custom design system
- **Routing**: React Router DOM 7.8.2 with protected routes
- **State Management**: React Context API with localStorage persistence
- **Icons**: Font Awesome 6.7.1 for consistent iconography

### **Backend**
- **Runtime**: Node.js with Express 5.1.0 framework
- **Database**: PostgreSQL with optimized queries
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Express-validator for input sanitization
- **CORS**: Configured for secure cross-origin requests
- **Environment**: dotenv for configuration management

### **Development Tools**
- **Linting**: ESLint 9.33.0 with React-specific rules
- **Version Control**: Git with comprehensive commit history
- **Package Management**: npm with lock file for consistency
- **Code Formatting**: Prettier integration for code consistency

---

## 📁 Project Structure

```
LaRama/
├── laRama_frontend/                 # React frontend application
│   ├── public/                      # Static assets and images
│   │   ├── images/                  # Product and category images
│   │   │   ├── decorations/        # Decorative item images
│   │   │   ├── nektie/             # Necktie product images
│   │   │   ├── phone-case/         # Phone case images
│   │   │   ├── prayer/             # Prayer beads images
│   │   │   └── purses/             # Purse collection images
│   │   └── index.html              # Application entry point
│   ├── src/                        # Source code
│   │   ├── components/             # Reusable React components
│   │   │   ├── auth/               # Authentication components
│   │   │   │   └── RequireAuth.jsx # Route protection wrapper
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Header.jsx      # Site navigation header
│   │   │   │   └── Footer.jsx      # Site footer with newsletter
│   │   │   └── ui/                 # UI utility components
│   │   │       └── ThemeToggle.jsx # Dark/light mode toggle
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.js      # Context definition
│   │   │   └── AuthContext.jsx     # Authentication provider
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── useAuth.js          # Authentication hook
│   │   ├── pages/                  # Application pages/routes
│   │   │   ├── About.jsx           # Company information page
│   │   │   ├── Auth.jsx            # Login/registration forms
│   │   │   ├── Cart.jsx            # Shopping cart interface
│   │   │   ├── Contact.jsx         # Customer contact form
│   │   │   ├── Customize.jsx       # Product customization tool
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── FAQ.jsx             # Frequently asked questions
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Privacy.jsx         # Privacy policy
│   │   │   ├── Products.jsx        # Product catalog
│   │   │   ├── Returns.jsx         # Return policy
│   │   │   ├── Shipping.jsx        # Shipping information
│   │   │   └── Terms.jsx           # Terms of service
│   │   ├── services/               # API communication layer
│   │   │   └── api.js              # HTTP client and endpoints
│   │   ├── App.jsx                 # Main application component
│   │   ├── App.css                 # Global application styles
│   │   ├── index.css               # Base styles and theme variables
│   │   └── main.jsx                # Application entry point
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # HTML template
│   ├── package.json                # Dependencies and scripts
│   └── vite.config.js              # Vite build configuration
├── laRama_backend/                 # Node.js backend API
│   ├── config/                     # Configuration files
│   │   └── database.js             # Database connection setup
│   ├── controllers/                # Request handlers
│   │   ├── authController.js       # Authentication logic
│   │   ├── cartController.js       # Shopping cart operations
│   │   ├── orderController.js      # Order management
│   │   └── productController.js    # Product data handling
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                 # JWT authentication middleware
│   │   └── validation.js           # Input validation middleware
│   ├── routes/                     # API route definitions
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── cart.js                 # Cart management endpoints
│   │   ├── orders.js               # Order processing endpoints
│   │   └── products.js             # Product catalog endpoints
│   ├── .env.example                # Environment variables template
│   ├── database.sql                # Database schema and seed data
│   ├── package.json                # Backend dependencies
│   └── server.js                   # Express server configuration
└── README.md                       # Project documentation (this file)
```

---

## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v13.0 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mohamadAbouNaasse-cs/LaRama-Advances.git
   cd LaRama-Advances
   ```

2. **Install Backend Dependencies**
   ```bash
   cd laRama_backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../laRama_frontend
   npm install
   ```

### Environment Setup

1. **Backend Configuration**
   ```bash
   cd laRama_backend
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=larama_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

### Database Setup

1. **Create Database**
   ```sql
   -- Connect to PostgreSQL as superuser
   CREATE DATABASE larama_db;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE larama_db TO your_username;
   ```

2. **Import Schema and Data**
   ```bash
   # From laRama_backend directory
   psql -U your_username -d larama_db -f database.sql
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd laRama_backend
   npm run dev
   # Server will run on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd laRama_frontend
   npm run dev
   # Application will run on http://localhost:5173
   ```

3. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000/api

---

## 🎯 Core Functionality

### **User Journey**
1. **Browse Products** → View curated handmade collections
2. **Customize Items** → Use interactive design tool for personalization
3. **Add to Cart** → Manage quantities and selections
4. **Secure Checkout** → JWT-authenticated purchasing process
5. **Order Communication** → WhatsApp integration for direct contact

### **Admin Capabilities**
- **Product Management**: Add, edit, and categorize products
- **Order Processing**: Track and manage customer orders
- **Newsletter Management**: Manage subscriber communications
- **Analytics Dashboard**: Monitor sales and user engagement

---

## 🔧 API Endpoints

### **Authentication**
```http
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User authentication
POST   /api/auth/logout       # Session termination
GET    /api/auth/verify       # Token verification
```

### **Products**
```http
GET    /api/products          # Retrieve all products
GET    /api/products/featured # Get featured products
GET    /api/products/:id      # Get single product
POST   /api/products          # Create new product (admin)
PUT    /api/products/:id      # Update product (admin)
DELETE /api/products/:id      # Delete product (admin)
```

### **Cart Management**
```http
GET    /api/cart              # Get user's cart
POST   /api/cart/add          # Add item to cart
PUT    /api/cart/update       # Update cart item quantity
DELETE /api/cart/remove/:id   # Remove item from cart
DELETE /api/cart/clear        # Clear entire cart
```

### **Orders**
```http
GET    /api/orders            # Get user's orders
POST   /api/orders            # Create new order
GET    /api/orders/:id        # Get specific order
PUT    /api/orders/:id        # Update order status (admin)
```

### **Newsletter**
```http
POST   /api/newsletter/subscribe    # Subscribe to newsletter
PUT    /api/newsletter/unsubscribe  # Unsubscribe from newsletter
```

---

## 🎨 Frontend Architecture

### **Component Hierarchy**
```
App.jsx
├── Header.jsx (Navigation, Theme Toggle, User Menu)
├── Router (React Router DOM)
│   ├── Public Routes
│   │   ├── Home.jsx (Landing page with featured products)
│   │   ├── Products.jsx (Product catalog with filtering)
│   │   ├── About.jsx (Company story and mission)
│   │   ├── Contact.jsx (Customer support forms)
│   │   ├── Auth.jsx (Login/Registration forms)
│   │   └── Legal Pages (Privacy, Terms, Returns, Shipping)
│   └── Protected Routes (RequireAuth wrapper)
│       ├── Dashboard.jsx (User profile and quick actions)
│       ├── Cart.jsx (Shopping cart management)
│       └── Customize.jsx (Interactive product designer)
└── Footer.jsx (Links, Newsletter, Contact info)
```

### **State Management Strategy**
- **Global State**: AuthContext for user authentication
- **Local State**: useState for component-specific data
- **Persistent State**: localStorage for cart and user preferences
- **API State**: Real-time data fetching with error handling

### **Routing Strategy**
- **Public Routes**: Accessible to all users
- **Protected Routes**: Require authentication
- **Conditional Rendering**: Based on authentication status
- **Redirect Logic**: Seamless user experience after login

---

## 🗄️ Database Schema

### **Users Table**
```sql
users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Products Table**
```sql
products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Cart Items Table**
```sql
cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    customization JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Newsletter Subscribers**
```sql
newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication System

### **JWT Implementation**
- **Token Generation**: Secure JWT creation with expiration
- **Token Verification**: Middleware-based route protection
- **Token Refresh**: Automatic session extension
- **Secure Storage**: HTTPOnly cookies for production deployment

### **Password Security**
- **Hashing**: bcrypt with salt rounds for password protection
- **Validation**: Strong password requirements
- **Reset Mechanism**: Secure password reset workflow

### **Session Management**
- **Persistent Login**: Remember user preferences
- **Automatic Logout**: Token expiration handling
- **Cross-tab Sync**: Consistent authentication state

---

## 📱 Responsive Design

### **Breakpoint Strategy**
- **Mobile First**: Base styles for mobile devices
- **Tablet**: Enhanced layout for medium screens (768px+)
- **Desktop**: Full-featured experience (1024px+)
- **Large Screens**: Optimized for high-resolution displays (1440px+)

### **Component Responsiveness**
- **Navigation**: Collapsible mobile menu with hamburger icon
- **Product Grid**: Adaptive columns based on screen size
- **Forms**: Single-column mobile layout, multi-column desktop
- **Images**: Responsive sizing with proper aspect ratios

---

## 🌙 Theme System

### **Dark/Light Mode**
- **CSS Variables**: Dynamic color scheme switching
- **User Preference**: Persistent theme selection
- **System Integration**: Respect OS dark mode preference
- **Smooth Transitions**: Animated theme transitions

### **Brand Colors**
```css
/* Light Theme */
--color-primary: #5C4B3D;      /* Rich Brown */
--color-accent: #D9A299;       /* Warm Rose */
--color-background: #FAF7F3;   /* Cream White */
--color-surface: #F0E4D3;      /* Light Beige */

/* Dark Theme */
--color-primary: #E8DDD4;      /* Light Brown */
--color-accent: #C4A29B;       /* Muted Rose */
--color-background: #1A1A1A;   /* Dark Gray */
--color-surface: #2D2D2D;      /* Medium Gray */
```

---

## 📧 Newsletter Integration

### **Subscription Management**
- **Email Validation**: Client and server-side validation
- **Duplicate Handling**: Graceful handling of existing subscribers
- **Unsubscribe Flow**: One-click unsubscribe mechanism
- **Source Tracking**: Track subscription sources for analytics

### **Email Features**
- **Welcome Series**: Automated onboarding emails
- **Product Updates**: New collection announcements
- **Custom Offers**: Personalized discount campaigns
- **Analytics**: Track open rates and engagement

---

## 📞 WhatsApp Business Integration

### **Order Communication**
- **Formatted Messages**: Professional order summaries
- **Direct Contact**: One-click WhatsApp communication
- **Order References**: Unique order tracking numbers
- **Business Account**: Professional WhatsApp Business integration

### **Message Template**
```
Dear LaRama Team,

I would like to request a custom order quote:

*Order Reference:* LRM-CUS-1699632000000
*Product Category:* Handcrafted Custom Purse

*DETAILED SPECIFICATIONS:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Bead Type: Crystal
• Color Preference: Black
• Chain Type: Metal
• Size Requirements: Medium
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Could you please provide:
• Final pricing with customizations
• Estimated completion timeframe
• Available delivery options

Thank you for your craftsmanship!
```

---

## 🚀 Deployment Strategy

> **Academic Note**: This project is currently configured for local development and demonstration. The deployment section outlines the production-ready architecture for potential future business implementation.

### **Current Development Setup**
```bash
# Local Development (Current)
Frontend: http://localhost:5173
Backend: http://localhost:5000
Database: Local PostgreSQL
```

### **Production Deployment Plan**

#### **Frontend Deployment (Netlify/Vercel)**
```bash
# Build production bundle
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Deploy to Vercel (Alternative)
npm install -g vercel
vercel --prod
```

#### **Backend Deployment (Railway/Heroku)**
```bash
# Railway deployment (Recommended)
npm install -g @railway/cli
railway login
railway init
railway up

# Heroku deployment (Alternative)
npm install -g heroku
heroku create larama-api
git push heroku main
```

#### **Production Environment Configuration**
```env
# Production Configuration Template
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=production_jwt_secret_256_bit_key
FRONTEND_URL=https://your-domain.com
```

### **Deployment Benefits for Business**
- **Global Accessibility**: Customers can access the store 24/7
- **Professional Presence**: Official website for LaRama business
- **Scalability**: Handle multiple concurrent users
- **SEO Optimization**: Search engine discoverability

---

## 🧪 Testing

### **Frontend Testing**
```bash
# Unit tests with Jest and React Testing Library
npm run test

# E2E tests with Cypress
npm run test:e2e

# Component tests
npm run test:components
```

### **Backend Testing**
```bash
# API endpoint tests with Jest and Supertest
npm run test

# Database tests
npm run test:db

# Integration tests
npm run test:integration
```

---

## 📚 Documentation

### **Code Documentation**
- **JSDoc Comments**: Comprehensive function documentation
- **Inline Comments**: Complex logic explanations
- **Component Props**: TypeScript-style prop documentation
- **API Documentation**: Endpoint specifications and examples

### **Architecture Documentation**
- **Database ERD**: Visual database relationship diagrams
- **Component Tree**: React component hierarchy
- **API Flow**: Request/response flow documentation
- **Authentication Flow**: Security implementation details

---

## 🤝 Contributing

### **Development Workflow**
1. **Fork Repository**: Create personal fork of the project
2. **Feature Branch**: Create branch for new features
3. **Code Standards**: Follow ESLint and Prettier configurations
4. **Commit Messages**: Use conventional commit format
5. **Pull Request**: Submit PR with detailed description

### **Code Standards**
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **Usage Rights**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

### **Limitations**
- ❌ Liability
- ❌ Warranty

---

## 👥 Team

### **Development Team**
- **Lead Developer**: [Mohamad Abou Naasse](https://github.com/mohamadAbouNaasse-cs)
- **University**: University of Balamand (UOB)
- **Course**: Advances in Computer Science
- **Project Type**: Full-Stack Web Development E-commerce Platform
- **Business Owner**: Rama (Sister) - LaRama Handcrafted Business

### **Project Background**
This project was developed as part of the Advances in Computer Science course at University of Balamand, combining academic excellence with real-world business application for the family handcrafted business "LaRama."

### **Acknowledgments**
- **University of Balamand Faculty**: For guidance and support in advanced computer science concepts
- **Open Source Community**: For amazing tools and libraries
- **Beta Testers**: For valuable feedback and suggestions

---

## 📞 Support

### **Technical Support**
- **Email**: [larama.handmade@gmail.com](mailto:larama.handmade@gmail.com)
- **WhatsApp**: [+961 71 361 960](https://wa.me/96171361960)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/mohamadAbouNaasse-cs/LaRama-Advances/issues)

### **Business Inquiries**
- **Custom Orders**: Use the in-app customization tool
- **Wholesale**: Contact via email for bulk pricing
- **Partnerships**: Business collaboration opportunities

### **Community**
- **Website**: [LaRama Handcrafted](https://larama-handcrafted.com) *(Coming Soon)*
- **Social Media**: Follow us for updates and new collections
- **Newsletter**: Subscribe for exclusive offers and news

---

## 🎉 Getting Started

Ready to explore LaRama Handcrafted? Follow the [Quick Start](#-quick-start) guide above to set up your development environment and start contributing to this beautiful e-commerce platform!

**Happy Coding!** 🚀✨

---

*Built with ❤️ by Mohamad Abou Naasse for the LaRama family business at University of Balamand*