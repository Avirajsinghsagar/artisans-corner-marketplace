import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

// ✅ SAFE parse — never crashes even if localStorage has garbage
function safeGetUser() {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function Navbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const token = localStorage.getItem("token");
  const userInfo = safeGetUser();

  const isSeller = userInfo?.role === "seller" || userInfo?.isSeller === true;
  const isAdmin = userInfo?.isAdmin === true || userInfo?.role === "admin";

  const fetchCartCount = async () => {
    try {
      if (!token) { setCount(0); return; }
      const res = await API.get("/cart");
      setCount(res.data.items?.length || 0);
    } catch (err) {
      console.log("Cart count error:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>

      <Link to="/" style={{ fontSize: "22px", fontWeight: "800", color: "#5c3d2e", textDecoration: "none" }}>
        Artisan's Corner
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>

        <Link to="/" style={{ color: "#555", fontWeight: "500", textDecoration: "none" }}>
          Products
        </Link>

        {token && (
          <Link to="/cart" style={{ color: "#555", fontWeight: "500", textDecoration: "none" }}>
            Cart ({count})
          </Link>
        )}

        {token && !isSeller && (
          <Link to="/my-orders" style={{ color: "#555", fontWeight: "500", textDecoration: "none" }}>
            My Orders
          </Link>
        )}

        {token && isSeller && (
          <Link to="/seller-dashboard" style={{ color: "#555", fontWeight: "500", textDecoration: "none" }}>
            Seller Dashboard
          </Link>
        )}

        {token && isAdmin && (
          <Link to="/admin/orders" style={{ color: "#555", fontWeight: "500", textDecoration: "none" }}>
            Admin
          </Link>
        )}

        {token ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#aaa", fontSize: "14px" }}>
              Hi, {userInfo?.name?.split(" ")[0] || "User"} {isSeller ? "🏪" : "🛍️"}
            </span>
            <button
              onClick={logoutHandler}
              style={{ backgroundColor: "#5c3d2e", color: "white", padding: "10px 20px", borderRadius: "12px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/login" style={{ backgroundColor: "transparent", color: "#5c3d2e", padding: "10px 20px", borderRadius: "12px", border: "2px solid #5c3d2e", fontWeight: "600", textDecoration: "none", fontSize: "14px" }}>
              Login
            </Link>
            <Link to="/register" style={{ backgroundColor: "#5c3d2e", color: "white", padding: "10px 20px", borderRadius: "12px", fontWeight: "600", textDecoration: "none", fontSize: "14px" }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;