import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ✅ Call API directly — no authService
      const res = await API.post("/users/login", { email, password });
      const data = res.data;

      console.log("LOGIN DATA:", data); // debug

      // ✅ Store correctly
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      const user = data.user;

      // ✅ Navigate based on role
      if (user?.role === "seller" || user?.isSeller === true) {
        navigate("/seller-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "14px",
    border: "2px solid #d6c5b5", fontSize: "16px", color: "#3e2c23",
    backgroundColor: "#fff", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "48px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "440px" }}>

        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#3e2c23", marginBottom: "8px" }}>
          Welcome Back
        </h1>
        <p style={{ color: "#aaa", marginBottom: "32px" }}>
          Login to your Artisan's Corner account
        </p>

        <form onSubmit={submitHandler}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "600", color: "#5c3d2e", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontWeight: "600", color: "#5c3d2e", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#aaa" : "#5c3d2e",
              color: "white", padding: "16px", borderRadius: "14px",
              border: "none", fontSize: "17px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "#888" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#b85c38", fontWeight: "700", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "12px", color: "#888" }}>
          Want to sell?{" "}
          <Link to="/register" style={{ color: "#b85c38", fontWeight: "700", textDecoration: "none" }}>
            Register as Seller
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;