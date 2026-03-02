import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ added

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

  // ✅ UPDATE ONLY ON BLUR (stable)
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

  if (loading) return <h2>Loading cart...</h2>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Cart</h2>

      {cart.items.map((item) => (
        <div
          key={item.product._id}
          style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}
        >
          {/* ✅ FIXED: backend uses title */}
          <h3>{item.product.title}</h3>

          <p>₹{item.product.price}</p>

          <input
            type="number"
            defaultValue={item.quantity}
            min="1"
            onBlur={(e) =>
              handleQuantityBlur(
                item.product._id,
                Number(e.target.value)
              )
            }
          />

          <button onClick={() => handleRemove(item.product._id)}>
            Remove
          </button>
        </div>
      ))}

      {/* ✅ ✅ ✅ PLACE ORDER BUTTON (NEW) */}
      {cart.items.length > 0 && (
        <button
          style={{ marginTop: "20px", padding: "10px 16px" }}
          onClick={() => navigate("/place-order")}
        >
          Place Order
        </button>
      )}
    </div>
  );
}

export default Cart;