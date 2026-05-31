import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "22px", color: "#5c3d2e", fontWeight: "600" }}>Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ backgroundColor: "white", padding: "48px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "480px" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>📦</div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23", marginBottom: "12px" }}>No Orders Yet</h2>
          <p style={{ color: "#888", marginBottom: "28px" }}>Your purchased handmade products will appear here.</p>
          <button
            onClick={() => navigate("/")}
            style={{ backgroundColor: "#5c3d2e", color: "white", padding: "14px 32px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "32px" }}>

      {/* TRACK ORDER MODAL */}
      {trackedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px", maxWidth: "500px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#3e2c23", marginBottom: "8px" }}>📦 Order Tracking</h2>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "28px" }}>ID: {trackedOrder._id}</p>

            {/* TRACKING STEPS */}
            {[
              { icon: "✅", label: "Order Placed", desc: "Your order has been confirmed", done: true },
              { icon: "💳", label: "Payment Confirmed", desc: trackedOrder.isPaid ? "Payment received successfully" : "Pending payment", done: trackedOrder.isPaid },
              { icon: "📦", label: "Packed & Dispatched", desc: "Your item is being prepared", done: trackedOrder.isPaid },
              { icon: "🚚", label: "Out for Delivery", desc: "Expected in 3-5 business days", done: false },
              { icon: "🏠", label: "Delivered", desc: trackedOrder.isDelivered ? ("Delivered on " + new Date(trackedOrder.deliveredAt).toLocaleDateString()) : "Pending delivery", done: trackedOrder.isDelivered },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: step.done ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div>
                  <p style={{ fontWeight: "700", color: step.done ? "#16a34a" : "#aaa", fontSize: "15px" }}>{step.label}</p>
                  <p style={{ color: "#888", fontSize: "13px" }}>{step.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setTrackedOrder(null)}
              style={{ width: "100%", backgroundColor: "#5c3d2e", color: "white", padding: "14px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23" }}>My Orders</h1>
        <p style={{ color: "#888", marginTop: "6px" }}>Track your artisan purchases and delivery updates.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {orders.map((order) => {
          const deliveryStatus = order.isDelivered ? "Delivered" : "Processing";

          return (
            <div key={order._id} style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>

              {/* ORDER HEADER */}
              <div style={{ padding: "20px 28px", borderBottom: "2px solid #f8f5f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "4px" }}>Order ID</p>
                  <p style={{ fontWeight: "700", color: "#3e2c23", fontSize: "13px" }}>{order._id}</p>
                  <p style={{ color: "#aaa", fontSize: "12px", marginTop: "4px" }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                    ✓ Paid
                  </span>
                  <span style={{ backgroundColor: order.isDelivered ? "#dcfce7" : "#fef9c3", color: order.isDelivered ? "#16a34a" : "#ca8a04", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                    {order.isDelivered ? "✓ Delivered" : "⏳ Processing"}
                  </span>
                </div>
              </div>

              {/* ORDER ITEMS - ✅ uses orderItems not items */}
              <div style={{ padding: "24px 28px" }}>
                {(order.orderItems || []).map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "16px", marginBottom: "16px", backgroundColor: "#f8f5f0", borderRadius: "16px", padding: "16px" }}>
                    <img
                      src={item.product?.image || item.image}
                      alt={item.product?.title || item.name}
                      style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/90?text=No+Image"; }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#3e2c23", marginBottom: "4px" }}>
                        {item.product?.title || item.name}
                      </h3>
                      <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "6px" }}>
                        Qty: {item.quantity} · Handmade by Local Artisan
                      </p>
                      <div style={{ color: "#f59e0b", fontSize: "13px", marginBottom: "4px" }}>⭐⭐⭐⭐⭐</div>
                      <p style={{ fontSize: "17px", fontWeight: "800", color: "#b85c38" }}>₹{item.price || item.product?.price}</p>
                    </div>
                  </div>
                ))}

                {/* TOTAL ROW */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "16px", borderTop: "2px solid #f8f5f0", flexWrap: "wrap", gap: "12px" }}>
                  <p style={{ color: "#888", fontSize: "14px" }}>
                    📅 {order.isDelivered ? "Delivered on " + new Date(order.deliveredAt).toLocaleDateString("en-IN") : "Expected Delivery: 3–5 business days"}
                  </p>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "#3e2c23" }}>Total: ₹{order.totalPrice}</p>
                </div>

                {/* BUTTONS */}
                <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setTrackedOrder(order)}
                    style={{ backgroundColor: "#5c3d2e", color: "white", padding: "12px 24px", borderRadius: "14px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#3e2c23"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#5c3d2e"}
                  >

                    
                    📦 Track Order
                  </button>

                  {order.orderItems?.[0]?.product?._id && (
                    <button
                      onClick={() => navigate("/product/" + order.orderItems[0].product._id)}
                      style={{ backgroundColor: "transparent", color: "#5c3d2e", padding: "12px 24px", borderRadius: "14px", border: "2px solid #5c3d2e", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#f4ece6"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      🔄 Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;