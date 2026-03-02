import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading orders...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — All Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10,
          }}
        >
          <p><strong>User:</strong> {order.user?.email}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p>
            <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
          </p>
          <p>
            <strong>Delivered:</strong> {order.isDelivered ? "Yes" : "No"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;