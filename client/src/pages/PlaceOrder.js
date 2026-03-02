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

  // ✅ Go to Stripe checkout
  const placeOrderHandler = () => {
    navigate("/checkout");
  };

  // ✅ Loading state
  if (loading) {
    return <p style={{ padding: 20 }}>Loading cart...</p>;
  }

  // ✅ Error state
  if (error) {
    return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  }

  // ✅ SAFE cart check (handles different shapes)
  const items =
    cart?.items || cart?.cartItems || [];

  if (!items.length) {
    return <p style={{ padding: 20 }}>Your cart is empty</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Place Order</h2>

      <p>Total items: {items.length}</p>

      <button
        style={{ marginTop: 20, padding: "10px 16px", cursor: "pointer" }}
        onClick={placeOrderHandler}
      >
        Proceed to Payment
      </button>
    </div>
  );
}

export default PlaceOrder;