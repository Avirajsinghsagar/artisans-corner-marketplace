import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import API from "../api/axios";


const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

 
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");

        const items =
          res.data.items ||
          res.data.cartItems ||
          res.data.products ||
          [];

        setCartItems(items);

        const total = items.reduce((sum, item) => {
          const price = Number(item.price || item.product?.price || 0);
          const qty = Number(item.quantity || item.qty || 1);
          return sum + price * qty;
        }, 0);

        setCartTotal(total);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    fetchCart();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

   
      await new Promise((res) => setTimeout(res, 1200));

      alert("Payment Successful ✅");

  
      await API.post("/orders", {
        orderItems: cartItems,
        totalAmount: cartTotal,
        paymentStatus: "Paid",
      });

 
      await API.delete("/cart/clear");

      window.location.href = "/my-orders";
    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Checkout</h2>

      <p>
        <strong>Total: ₹{cartTotal}</strong>
      </p>

      <p style={{ fontSize: "12px", color: "gray" }}>
        Demo payment mode enabled
      </p>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
        
          <CardElement />
        </div>

        <button disabled={loading || cartTotal === 0}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
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