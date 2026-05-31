import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!userInfo?.isAdmin && userInfo?.role !== "admin") {
      navigate("/");
      return;
    }
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

  const markDelivered = async (id) => {
    try {
      await API.put("/orders/" + id + "/deliver");
      fetchOrders();
      alert("Order marked as delivered!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "22px", color: "#5c3d2e", fontWeight: "600" }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "32px" }}>

      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23" }}>Admin — All Orders</h1>
        <p style={{ color: "#888", marginTop: "6px" }}>{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#aaa", fontSize: "18px" }}>No orders yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => (
            <div key={order._id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>

              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <p style={{ color: "#aaa", fontSize: "12px" }}>Order ID</p>
                  <p style={{ fontWeight: "700", color: "#3e2c23", fontSize: "13px" }}>{order._id}</p>
                  <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>
                    Customer: <strong>{order.user?.name || order.user?.email || "Unknown"}</strong>
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <span style={{ backgroundColor: order.isPaid ? "#dcfce7" : "#fee2e2", color: order.isPaid ? "#16a34a" : "#dc2626", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                    {order.isPaid ? "✓ Paid" : "✗ Unpaid"}
                  </span>
                  <span style={{ backgroundColor: order.isDelivered ? "#dcfce7" : "#fef9c3", color: order.isDelivered ? "#16a34a" : "#ca8a04", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                    {order.isDelivered ? "✓ Delivered" : "⏳ Processing"}
                  </span>
                </div>
              </div>

              {/* ORDER ITEMS */}
              {(order.orderItems || []).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", backgroundColor: "#f8f5f0", borderRadius: "12px", padding: "12px", marginBottom: "8px" }}>
                  <img
                    src={item.image || item.product?.image}
                    alt={item.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/60?text=No+Image"; }}
                  />
                  <div>
                    <p style={{ fontWeight: "600", color: "#3e2c23", fontSize: "14px" }}>{item.name}</p>
                    <p style={{ color: "#aaa", fontSize: "13px" }}>Qty: {item.quantity} · ₹{item.price}</p>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "12px" }}>
                <p style={{ fontSize: "18px", fontWeight: "800", color: "#b85c38" }}>Total: ₹{order.totalPrice}</p>
                {!order.isDelivered && (
                  <button
                    onClick={() => markDelivered(order._id)}
                    style={{ backgroundColor: "#5c3d2e", color: "white", padding: "10px 20px", borderRadius: "12px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
                  >
                    ✓ Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;