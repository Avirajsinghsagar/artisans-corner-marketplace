import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminOrders from "./pages/AdminOrders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import PlaceOrder from "./pages/PlaceOrder";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";

function App() {
  return (
    <div style={{ backgroundColor: "#f8f5f0", minHeight: "100vh" }}>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* PROTECTED - BUYER */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

        {/* PROTECTED - SELLER */}
        <Route path="/seller-dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />

        {/* PROTECTED - ADMIN */}
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;