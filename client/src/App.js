import { Routes, Route } from "react-router-dom";

// 🔹 Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// 🔹 Pages
import Products from "./pages/Products";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import SellerDashboard from "./pages/SellerDashboard";
import ProductDetails from "./pages/ProductDetails";
import PlaceOrder from "./pages/PlaceOrder"; // ✅ ADDED

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* ✅ ADDED PLACE ORDER ROUTE */}
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* 🔥 Seller Dashboard */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;