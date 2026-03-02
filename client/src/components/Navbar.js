import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const token = localStorage.getItem("token");

  // ✅ safe parse (prevents crash if null)
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const fetchCartCount = async () => {
    try {
      if (!token) {
        setCount(0);
        return;
      }

      const res = await API.get("/cart");
      setCount(res.data.items?.length || 0);
    } catch (err) {
      console.log("Cart count error:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    // eslint-disable-next-line
  }, [token]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Artisan Marketplace
      </Link>

      <div style={styles.links}>
        <Link to="/">Products</Link>

        {token && <Link to="/cart">Cart ({count})</Link>}

        {token && <Link to="/my-orders">My Orders</Link>}

        {/* ✅ ADMIN ONLY */}
        {userInfo?.isAdmin && (
          <Link to="/admin/orders">Admin</Link>
        )}

        {token ? (
          <button onClick={logoutHandler}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#eee",
  },
  logo: {
    fontWeight: "bold",
    textDecoration: "none",
    color: "black",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
};

export default Navbar;