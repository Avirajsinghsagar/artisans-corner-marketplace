import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function PlaceOrder() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch failed", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "22px", color: "#5c3d2e", fontWeight: "600" }}>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  // ✅ filter null products
  const items = (cart?.items || cart?.cartItems || []).filter(
    (item) => item.product !== null && item.product !== undefined
  );

  if (!items.length) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ backgroundColor: "white", padding: "48px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🛒</div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23", marginBottom: "12px" }}>Your Cart is Empty</h2>
          <p style={{ color: "#888", marginBottom: "28px" }}>Add handmade products before checkout.</p>
          <button
            onClick={() => navigate("/")}
            style={{ backgroundColor: "#5c3d2e", color: "white", padding: "14px 32px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = 49;
  const platformFee = 19;
  const total = subtotal + deliveryFee + platformFee;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "32px" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23" }}>Place Order</h1>
        <p style={{ color: "#888", marginTop: "6px" }}>Review your order before secure payment.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

        {/* LEFT - ORDER ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {items.map((item) => (
            <div key={item.product._id} style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "20px", display: "flex", gap: "20px" }}>

              {/* ✅ Real Cloudinary image */}
              <img
                src={item.product.image}
                alt={item.product.title}
                style={{ width: "130px", height: "130px", objectFit: "cover", borderRadius: "16px", flexShrink: 0 }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/130?text=No+Image"; }}
              />

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#3e2c23", marginBottom: "4px" }}>
                  {item.product.title}
                </h2>
                <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "6px" }}>
                  {item.product.category} · Handmade by Local Artisan
                </p>
                <div style={{ color: "#f59e0b", fontSize: "13px", marginBottom: "8px" }}>
                  ⭐⭐⭐⭐⭐ <span style={{ color: "#aaa" }}>(4.8)</span>
                </div>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "#b85c38", marginBottom: "8px" }}>
                  ₹{item.product.price}
                </p>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Quantity: <strong>{item.quantity}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - PAYMENT SUMMARY */}
        <div>
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "sticky", top: "24px" }}>

            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#3e2c23", marginBottom: "24px" }}>
              Payment Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Subtotal</span>
                <span style={{ fontWeight: "600" }}>₹{subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Delivery Fee</span>
                <span style={{ fontWeight: "600" }}>₹{deliveryFee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Platform Fee</span>
                <span style={{ fontWeight: "600" }}>₹{platformFee}</span>
              </div>
              <hr style={{ border: "1px solid #f0e8df" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800", color: "#3e2c23" }}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* ITEMS COUNT */}
            <div style={{ backgroundColor: "#f8f5f0", borderRadius: "12px", padding: "12px 16px", margin: "20px 0", fontSize: "14px", color: "#5c3d2e", fontWeight: "600" }}>
              🛍 {items.length} item{items.length > 1 ? "s" : ""} in your order
            </div>

            {/* PROCEED BUTTON */}
            <button
              onClick={() => navigate("/checkout")}
              style={{ width: "100%", backgroundColor: "#5c3d2e", color: "white", padding: "16px", borderRadius: "16px", border: "none", fontSize: "17px", fontWeight: "700", cursor: "pointer" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#3e2c23"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#5c3d2e"}
            >
              🔒 Proceed to Secure Payment
            </button>

            <p style={{ fontSize: "13px", color: "#aaa", marginTop: "12px", textAlign: "center" }}>
              🔐 Secure payment powered by Stripe
            </p>

            {/* BACK TO CART */}
            <button
              onClick={() => navigate("/cart")}
              style={{ width: "100%", marginTop: "10px", backgroundColor: "transparent", color: "#5c3d2e", padding: "12px", borderRadius: "16px", border: "2px solid #5c3d2e", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;