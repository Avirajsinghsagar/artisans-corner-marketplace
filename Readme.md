# 🛍️ Artisan's Corner – AI-Powered Multi-Vendor Marketplace

Artisan's Corner is a full-stack MERN multi-vendor e-commerce platform similar to Etsy, where artisans can sell handmade products and customers can browse, purchase, and review items — powered by AI features for both buyers and sellers.

> Built as part of the Web Development Internship at Persevex.

🔗 **GitHub:** [github.com/Avirajsinghsagar/artisans-corner-marketplace](https://github.com/Avirajsinghsagar/artisans-corner-marketplace)

---

## ✨ What Makes This Special

| Feature | Description |
|---------|-------------|
| 🤖 AI Description Generator | Sellers generate product descriptions with one click using AI |
| 🛍️ AI Shopping Assistant | Buyers get personalized product recommendations via chatbot |
| 💳 Real Stripe Payments | Full payment intent flow with INR support |
| 📦 Order Tracking | Step-by-step delivery status for every order |
| 🏪 Multi-Vendor | Separate seller dashboard with analytics |
| ☁️ Cloud Images | Cloudinary integration for product images |
| 🔐 Role-Based Auth | Buyer / Seller / Admin access control |

---

## 🚀 Features

### 👤 Authentication & Roles
- Register as **Buyer** or **Seller** (separate onboarding)
- JWT-based secure login
- Role-based protected routes
- Auto-redirect to correct dashboard after login

### 🛒 Buyer Experience
- Browse all handmade products with search & category filter
- View full product details with reviews
- Add/remove/update cart items
- Secure Stripe checkout (INR, paise conversion)
- Real order tracking with delivery status steps
- **🤖 AI Shopping Chatbot** — type "gift for mom under ₹500" and get real product recommendations

### 🏪 Seller Experience
- Dedicated Seller Dashboard (protected route)
- Add, edit, delete products with Cloudinary image upload
- **✨ AI Description Generator** — fill title + category, click one button to get a compelling product description
- Sales stats: Total Products, Total Orders, Total Revenue

### 🔑 Admin Experience
- View all orders across all users
- Mark orders as Delivered
- Protected admin-only routes

### 💳 Payments
- Stripe Payment Intent integration
- INR currency with paise conversion
- Order created automatically after successful payment
- Cart cleared after checkout

### 📦 Orders
- Full order history per buyer
- Track order with 5-step delivery timeline (Placed → Payment → Packed → Out for Delivery → Delivered)
- Buy Again button from order history

### ⭐ Reviews
- Buyers can leave star ratings and comments on purchased products
- Reviews displayed on product detail page

---

## 🧱 Tech Stack

### Frontend
- React.js + React Router v6
- Axios for API calls
- Stripe React SDK (`@stripe/react-stripe-js`)
- Inline CSS (no Tailwind dependency issues)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication + bcryptjs
- Multer (file upload middleware)
- Stripe Node SDK
- Cloudinary SDK

### AI Integration
- OpenRouter API (`openrouter/auto` model)
- Two AI features: product description + shopping assistant

### Services
- **MongoDB Atlas** — cloud database
- **Cloudinary** — product image storage
- **Stripe** — payment processing
- **OpenRouter** — free AI inference

---

## 🗄️ Database Models

| Model | Fields |
|-------|--------|
| User | name, email, password, role, isSeller, isAdmin |
| Product | title, description, price, category, image, seller |
| Cart | user, items (product + quantity) |
| Order | user, orderItems, shippingAddress, paymentMethod, isPaid, isDelivered |
| Review | user, product, rating, comment |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Avirajsinghsagar/artisans-corner-marketplace.git
cd artisans-corner-marketplace
```

### 2️⃣ Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
```

Create `client/.env`:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 4️⃣ Run the project

```bash
# Terminal 1 — Backend
cd server
node server.js

# Terminal 2 — Frontend
cd client
npm start
```

---

## 🧪 Test the Application

### 🔹 Buyer Flow
1. Register at `/register` → select **Buyer**
2. Browse products on home page
3. Click **🛍️ chat button** (bottom right) → ask AI for recommendations
4. Add products to cart
5. Checkout with Stripe test card
6. View orders at `/my-orders` → click **Track Order**

### 🔹 Seller Flow
1. Register at `/register` → select **Seller**
2. Go to **Seller Dashboard** (auto-redirect after login)
3. Fill product title + category → click **✨ Write with AI**
4. Upload image → click **Add Product**
5. Product appears on home page instantly

### 🔹 Admin Flow
1. Set `isAdmin: true` in MongoDB for your user
2. Login → click **Admin** in navbar
3. View all orders → mark as delivered

---

## 💳 Stripe Test Card

```
Card Number : 4242 4242 4242 4242
Expiry      : 12/29
CVC         : 123
ZIP         : 110001
```

---

## 🌐 Routes

| Page | Route |
|------|-------|
| Home / Products | `/` |
| Login | `/login` |
| Register | `/register` |
| Product Detail | `/product/:id` |
| Cart | `/cart` |
| Place Order | `/place-order` |
| Checkout | `/checkout` |
| My Orders | `/my-orders` |
| Seller Dashboard | `/seller-dashboard` |
| Admin Orders | `/admin/orders` |

---

## 📁 Folder Structure

```
artisans-corner-marketplace/
├── client/
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Navbar, ProtectedRoute, AIRecommender
│   │   ├── pages/         # All page components
│   │   └── services/      # Cart, Auth services
│   └── package.json
│
├── server/
│   ├── config/            # DB + Cloudinary config
│   ├── controllers/       # Product, Seller controllers
│   ├── middleware/         # Auth middleware, Upload
│   ├── models/            # User, Product, Cart, Order, Review
│   ├── routes/            # All API routes including AI
│   └── server.js
│
└── README.md
```

---

## 📊 Project Status

| Feature | Status |
|---------|--------|
| Multi-vendor architecture | ✅ Complete |
| Buyer & Seller registration | ✅ Complete |
| Cloudinary image upload | ✅ Complete |
| Stripe payment flow | ✅ Complete |
| Order tracking | ✅ Complete |
| Reviews & ratings | ✅ Complete |
| AI product description | ✅ Complete |
| AI shopping chatbot | ✅ Complete |
| Admin panel | ✅ Complete |
| Deployment | 🔄 In Progress |

---

## 🔒 Security
- All secrets stored in `.env` (never committed to Git)
- JWT authentication on all protected routes
- Seller ownership check before edit/delete
- Admin-only routes protected by middleware

---

## 👨‍💻 Author

**Aviraj Singh Sagar**
Web Development Intern – Persevex
📧 avirajsinghsagar@gmail.com
🔗 [github.com/Avirajsinghsagar](https://github.com/Avirajsinghsagar)

---

## 📌 Future Improvements
- Live deployment (Render + Vercel)
- Real-time notifications
- Advanced analytics charts
- Wishlist feature
- Product search with filters
- Mobile responsive design

---

⭐ *If you found this project useful, consider giving it a star on GitHub!*
