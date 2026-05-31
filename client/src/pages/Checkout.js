import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [fetchingCart, setFetchingCart] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        const items = (res.data?.items || []).filter(
          (item) => item.product !== null && item.product !== undefined
        );
        setCartItems(items);
        const total = items.reduce((sum, item) => {
          return sum + (item.product?.price || 0) * (item.quantity || 1);
        }, 0);
        setCartTotal(total);
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setFetchingCart(false);
      }
    };
    fetchCart();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setLoading(true);

      // Simulate payment delay
      await new Promise((res) => setTimeout(res, 1500));

      // Place the order
      await API.post("/orders", {
        shippingAddress: {
          address: "Default Address",
          city: "India",
          postalCode: "000000",
          country: "India",
        },
        paymentMethod: "Stripe",
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        totalPrice: cartTotal + 49 + 19,
      });

      // Clear cart
      await API.delete("/cart/clear");

      alert("Payment Successful! Order placed.");
      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 49;
  const platformFee = 19;
  const total = cartTotal + deliveryFee + platformFee;

  if (fetchingCart) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "22px", color: "#5c3d2e", fontWeight: "600" }}>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "32px" }}>

      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23" }}>Secure Checkout</h1>
        <p style={{ color: "#888", marginTop: "6px" }}>Complete your payment to place the order.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

        {/* LEFT - ORDER ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#3e2c23", marginBottom: "8px" }}>
            Order Items
          </h2>

          {cartItems.map((item) => (
            <div key={item.product._id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "16px", display: "flex", gap: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <img
                src={item.product.image}
                alt={item.product.title}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=No+Image"; }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#3e2c23", marginBottom: "4px" }}>{item.product.title}</h3>
                <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "4px" }}>{item.product.category} · Qty: {item.quantity}</p>
                <p style={{ fontSize: "17px", fontWeight: "800", color: "#b85c38" }}>₹{item.product.price}</p>
              </div>
            </div>
          ))}

          {/* PAYMENT FORM */}
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginTop: "8px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#3e2c23", marginBottom: "20px" }}>
              💳 Payment Details
            </h2>

            <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "16px", backgroundColor: "#f8f5f0", padding: "10px 14px", borderRadius: "10px" }}>
              🔒 Demo mode — use test card: <strong>4242 4242 4242 4242</strong> · Any future date · Any CVC
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ border: "2px solid #d6c5b5", borderRadius: "12px", padding: "16px", backgroundColor: "#fdfaf7", marginBottom: "20px" }}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#3e2c23",
                        "::placeholder": { color: "#aaa" },
                      },
                    },
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || cartTotal === 0}
                style={{
                  width: "100%",
                  backgroundColor: loading ? "#aaa" : "#5c3d2e",
                  color: "white",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "none",
                  fontSize: "17px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Processing Payment..." : "🔒 Pay ₹" + total + " Now"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div>
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "sticky", top: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#3e2c23", marginBottom: "20px" }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Subtotal</span>
                <span style={{ fontWeight: "600" }}>₹{cartTotal}</span>
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

            <div style={{ backgroundColor: "#f8f5f0", borderRadius: "12px", padding: "12px", marginTop: "20px", fontSize: "13px", color: "#5c3d2e", textAlign: "center" }}>
              🔐 256-bit SSL encrypted payment
            </div>

            <button
              onClick={() => navigate("/place-order")}
              style={{ width: "100%", marginTop: "12px", backgroundColor: "transparent", color: "#5c3d2e", padding: "12px", borderRadius: "14px", border: "2px solid #5c3d2e", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >
              ← Back to Order Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}