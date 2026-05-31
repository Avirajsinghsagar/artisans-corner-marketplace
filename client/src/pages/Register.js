import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/users/register", {
        name,
        email,
        password,
        role,
        isSeller: role === "seller",
      });

      // ✅ store token and userInfo
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      // ✅ FIXED: no window.location.reload() — just navigate
      if (data.user?.role === "seller" || data.user?.isSeller) {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "2px solid #d6c5b5",
    fontSize: "16px",
    color: "#3e2c23",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "white",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "48px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "440px" }}>

        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#3e2c23", marginBottom: "8px" }}>
          Create Account
        </h1>
        <p style={{ color: "#aaa", marginBottom: "32px" }}>
          Join Artisan's Corner today
        </p>

        <form onSubmit={submitHandler}>

          {/* NAME */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "600", color: "#5c3d2e", marginBottom: "8px" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "600", color: "#5c3d2e", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* ROLE SELECTOR */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontWeight: "600", color: "#5c3d2e", marginBottom: "12px" }}>
              I want to join as:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

              {/* BUYER CARD */}
              <div
                onClick={() => setRole("buyer")}
                style={{
                  border: "2px solid " + (role === "buyer" ? "#5c3d2e" : "#d6c5b5"),
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: role === "buyer" ? "#f8f5f0" : "white",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛍️</div>
                <p style={{ fontWeight: "700", color: role === "buyer" ? "#3e2c23" : "#aaa", fontSize: "15px" }}>
                  Buyer
                </p>
                <p style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
                  Browse & buy products
                </p>
              </div>

              {/* SELLER CARD */}
              <div
                onClick={() => setRole("seller")}
                style={{
                  border: "2px solid " + (role === "seller" ? "#5c3d2e" : "#d6c5b5"),
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: role === "seller" ? "#f8f5f0" : "white",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏪</div>
                <p style={{ fontWeight: "700", color: role === "seller" ? "#3e2c23" : "#aaa", fontSize: "15px" }}>
                  Seller
                </p>
                <p style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
                  Sell handmade products
                </p>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
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
            {loading ? "Creating account..." : (role === "seller" ? "Register as Seller 🏪" : "Register as Buyer 🛍️")}
          </button>

        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "#888" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#b85c38", fontWeight: "700", textDecoration: "none" }}>
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;