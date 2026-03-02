# 🛍️ Artisan's Corner – Multi-Vendor Marketplace

Artisan's Corner is a full-stack MERN multi-vendor e-commerce platform similar to Etsy, where artisans can sell handmade products and customers can browse, purchase, and review items.

This project was built as part of the Web Development Internship at Persevex.

---

## ✨ Project Highlights

* Multi-vendor marketplace architecture
* Secure JWT authentication
* Role-based access control
* Stripe payment integration
* Seller analytics dashboard
* Clean MERN folder structure
* Internship-ready production flow

---

## 🚀 Live Features

### 👤 Authentication & Roles

* User Registration & Login (JWT based)
* Role-based access (Buyer / Seller)
* Become a Seller workflow
* Protected routes

### 🛒 Buyer Experience

* Browse all products
* View product details
* Add to cart / remove from cart
* Secure checkout with Stripe (test mode)
* Place orders
* View order history
* Leave reviews (UI implemented)

### 🏪 Seller Experience

* Seller dashboard
* View own products
* Delete products
* Sales statistics:

  * Total products
  * Total orders
  * Total revenue

### 💳 Payments

* Stripe Payment Intent integration
* Test card support
* Automatic order creation after payment
* Cart cleared after successful payment

---

## 🧱 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Stripe React SDK

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

### Services

* Stripe (payments)
* Cloudinary (optional – not implemented in this version)

---

## 🗄️ Database Models

* User (Buyer/Seller roles)
* Product (linked to seller)
* Cart
* Order
* Review

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/artisans-corner-marketplace.git
cd artisans-corner-marketplace
```

### 2️⃣ Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file inside **server/**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

Create a `.env` file inside **client/**:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

---

### 4️⃣ Run the project

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd client
npm start
```

---

## 🧪 How to Test the Application

### 🔹 Buyer Flow

1. Register or login as buyer
2. Browse products
3. Add product to cart
4. Go to checkout
5. Pay using Stripe test card
6. View order in **My Orders**

### 🔹 Seller Flow

1. Login as buyer
2. Click **Become Seller**
3. Open **Seller Dashboard**
4. View products and sales statistics

---

## 🔑 Demo Credentials

### 👤 Buyer Account

Email: [aviraj@test.com](mailto:aviraj@test.com)
Password: 123456

### 🏪 Seller Account

Login with buyer account → click **Become Seller**

---

## 💳 Stripe Test Card

Card Number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
ZIP: any

---

## 🌐 Key Routes

| Page             | Route               |
| ---------------- | ------------------- |
| Products         | `/`                 |
| Login            | `/login`            |
| Cart             | `/cart`             |
| Checkout         | `/checkout`         |
| Place Order      | `/place-order`      |
| My Orders        | `/my-orders`        |
| Seller Dashboard | `/seller-dashboard` |
| Product Details  | `/product/:id`      |

---

## 📁 Folder Structure

```
artisans-corner-marketplace/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

---

## 📊 Project Status

✅ Multi-vendor architecture
✅ Seller dashboard
✅ Cart & checkout flow
✅ Stripe integration
✅ Order management
✅ Internship submission ready

---

## 🔒 Security Notes

* Sensitive keys stored in `.env`
* JWT authentication implemented
* Protected API routes

---

## 👨‍💻 Author

**Aviraj Singh Sagar**
Web Development Intern – Persevex
Email: [avirajsinghsagar@gmail.com](mailto:avirajsinghsagar@gmail.com)

---

## 📌 Future Improvements

* Cloudinary image upload
* Commission automation
* Advanced analytics charts
* Redux state management
* Production deployment

---

⭐ This project was developed for educational and internship evaluation purposes.
