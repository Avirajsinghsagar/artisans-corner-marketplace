import { useEffect, useState } from "react";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading orders...</h2>;

  if (!orders.length) return <h2>No orders found</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10,
          }}
        >
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p>
            <strong>Status:</strong>{" "}
            {order.isDelivered ? "Delivered" : "Processing"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;