import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getMyCart();
      setCart(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityBlur = async (productId, qty) => {
    try {
      if (qty < 1) return;
      await updateCartItem(productId, qty);
      await fetchCart();
    } catch (err) {
      console.error("Quantity update failed:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);
      await fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  // ✅ FIXED: filter out null products to prevent crash
  const validItems = cart?.items?.filter(
    (item) => item.product !== null && item.product !== undefined
  ) || [];

  const subtotal = validItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity, 0
  );
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const platformFee = subtotal > 0 ? 19 : 0;
  const total = subtotal + deliveryFee + platformFee;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "22px", color: "#5c3d2e", fontWeight: "600" }}>Loading cart...</p>
      </div>
    );
  }

  if (!cart || validItems.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ backgroundColor: "white", padding: "48px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "480px", width: "100%" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🛒</div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23", marginBottom: "12px" }}>Your Cart is Empty</h2>
          <p style={{ color: "#888", marginBottom: "28px" }}>Discover handmade treasures crafted by local artisans.</p>
          <button
            onClick={() => navigate("/")}
            style={{ backgroundColor: "#5c3d2e", color: "white", padding: "14px 32px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "32px" }}>

      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23" }}>Shopping Cart</h1>
        <p style={{ color: "#888", marginTop: "6px" }}>Review your handmade products before checkout.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

        {/* LEFT - CART ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {validItems.map((item) => (
            <div key={item.product._id} style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "20px", display: "flex", gap: "20px" }}>

              {/* ✅ Uses actual Cloudinary image */}
              <img
                src={item.product.image}
                alt={item.product.title}
                style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "16px", flexShrink: 0 }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/140?text=No+Image"; }}
              />

              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#3e2c23", marginBottom: "4px" }}>
                    {item.product.title}
                  </h2>
                  <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "4px" }}>
                    {item.product.category} · Handmade by Local Artisan
                  </p>
                  <div style={{ color: "#f59e0b", fontSize: "14px", marginBottom: "8px" }}>
                    ⭐⭐⭐⭐⭐ <span style={{ color: "#aaa" }}>(4.8)</span>
                  </div>
                  <p style={{ fontSize: "22px", fontWeight: "800", color: "#b85c38" }}>
                    ₹{item.product.price}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontWeight: "600", color: "#555" }}>Qty:</span>
                    <input
                      type="number"
                      defaultValue={item.quantity}
                      min="1"
                      onBlur={(e) => handleQuantityBlur(item.product._id, Number(e.target.value))}
                      style={{ width: "70px", border: "2px solid #d6c5b5", borderRadius: "10px", padding: "8px 12px", fontSize: "16px", color: "#3e2c23", outline: "none" }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    style={{ color: "#ef4444", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "15px" }}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div>
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "sticky", top: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#3e2c23", marginBottom: "24px" }}>Order Summary</h2>

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

            <button
              onClick={() => navigate("/place-order")}
              style={{ width: "100%", marginTop: "28px", backgroundColor: "#5c3d2e", color: "white", padding: "16px", borderRadius: "16px", border: "none", fontSize: "17px", fontWeight: "700", cursor: "pointer" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#3e2c23"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#5c3d2e"}
            >
              Proceed to Checkout →
            </button>

            <button
              onClick={() => navigate("/")}
              style={{ width: "100%", marginTop: "12px", backgroundColor: "transparent", color: "#5c3d2e", padding: "14px", borderRadius: "16px", border: "2px solid #5c3d2e", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;