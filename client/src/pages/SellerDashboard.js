import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function safeGetUser() {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pottery");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // ✅ AI STATE
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  useEffect(() => {
    const user = safeGetUser();
    const token = localStorage.getItem("token");
    if (!token || (!user?.isSeller && user?.role !== "seller")) {
      navigate("/");
    }
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await API.get("/products/my-products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load seller products", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/seller/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchMyProducts(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setPrice("");
    setCategory("Pottery"); setImage(null); setEditingId(null);
    setAiSuccess(false);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setCategory(p.category);
    setImage(null);
    setAiSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ AI DESCRIPTION GENERATOR
  const generateDescription = async () => {
    if (!title || !category) {
      alert("Please enter product title and select category first.");
      return;
    }
    try {
      setAiLoading(true);
      setAiSuccess(false);
      const res = await API.post("/ai/generate-description", { title, category, price });
      setDescription(res.data.description);
      setAiSuccess(true);
    } catch (err) {
      alert("AI generation failed. Check your API key or try again.");
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      if (image) formData.append("image", image);

      if (editingId) {
        await API.put("/products/" + editingId, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated!");
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added!");
      }

      resetForm();
      fetchMyProducts();
      fetchStats();
    } catch (err) {
      console.error("Submit failed", err);
      alert("Failed to save product. Try again.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete("/products/" + id);
      fetchMyProducts();
      fetchStats();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const inputStyle = {
    border: "2px solid #d6c5b5", padding: "14px 16px", borderRadius: "16px",
    fontSize: "16px", color: "#3e2c23", backgroundColor: "#ffffff",
    width: "100%", outline: "none", boxSizing: "border-box",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "22px", color: "#5c3d2e", fontWeight: "600" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "24px" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23", marginBottom: "6px" }}>Seller Dashboard</h1>
        <p style={{ color: "#888", fontSize: "16px" }}>Manage your handmade artisan products.</p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        {[
          { label: "Total Products", value: stats.totalProducts, color: "#5c3d2e" },
          { label: "Total Orders", value: stats.totalOrders, color: "#5c3d2e" },
          { label: "Total Revenue", value: "₹" + stats.totalRevenue, color: "#b85c38" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <p style={{ color: "#999", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "40px", fontWeight: "800", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ADD / EDIT FORM */}
      <div style={{ background: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23" }}>
            {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          {editingId && (
            <button onClick={resetForm} style={{ backgroundColor: "#f8f5f0", color: "#5c3d2e", padding: "10px 20px", borderRadius: "12px", border: "2px solid #d6c5b5", fontWeight: "600", cursor: "pointer" }}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
            <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} required min="1" style={inputStyle} />

            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              <option value="Pottery">Pottery</option>
              <option value="Decor">Decor</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Paintings">Paintings</option>
              <option value="Gifts">Gifts</option>
            </select>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "#5c3d2e", fontWeight: "600", fontSize: "14px" }}>
                Product Image {editingId && "(leave empty to keep current)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required={!editingId}
                style={{ ...inputStyle, padding: "10px 16px", cursor: "pointer" }}
              />
              {image && <p style={{ color: "#5c3d2e", fontSize: "13px" }}>Selected: {image.name}</p>}
            </div>

            {/* ✅ AI DESCRIPTION SECTION */}
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ color: "#5c3d2e", fontWeight: "600", fontSize: "14px" }}>
                  Product Description
                </label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={aiLoading}
                  style={{
                    backgroundColor: aiLoading ? "#aaa" : aiSuccess ? "#16a34a" : "#b85c38",
                    color: "white", padding: "8px 18px", borderRadius: "10px",
                    border: "none", fontSize: "13px", fontWeight: "700",
                    cursor: aiLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {aiLoading ? "⏳ Generating..." : aiSuccess ? "✅ Generated!" : "✨ Write with AI"}
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>
                💡 Fill in title & category first, then click "Write with AI"
              </p>
              <textarea
                placeholder="Write your description or click 'Write with AI' above..."
                value={description}
                onChange={(e) => { setDescription(e.target.value); setAiSuccess(false); }}
                required
                rows="4"
                style={{ ...inputStyle, resize: "vertical", borderColor: aiSuccess ? "#16a34a" : "#d6c5b5" }}
              />
            </div>

            <button
              type="submit"
              style={{ gridColumn: "1 / -1", backgroundColor: editingId ? "#b85c38" : "#5c3d2e", color: "#fff", padding: "16px", borderRadius: "16px", fontSize: "16px", fontWeight: "700", border: "none", cursor: "pointer" }}
            >
              {editingId ? "💾 Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23", marginBottom: "32px" }}>My Products</h2>

        {products.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "24px", padding: "48px", textAlign: "center" }}>
            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#5c3d2e", marginBottom: "8px" }}>No Products Yet</h3>
            <p style={{ color: "#aaa" }}>Start adding your handmade products above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "32px" }}>
            {products.map((p) => (
              <div key={p._id} style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "220px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/280x220?text=No+Image"; }} />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#3e2c23" }}>{p.title}</h3>
                    <span style={{ backgroundColor: "#f8f5f0", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", color: "#5c3d2e" }}>{p.category}</span>
                  </div>
                  <p style={{ color: "#777", fontSize: "13px", marginBottom: "12px" }}>{p.description?.slice(0, 80)}...</p>
                  <p style={{ fontSize: "22px", fontWeight: "800", color: "#b85c38", marginBottom: "16px" }}>₹{p.price}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button onClick={() => startEdit(p)} style={{ backgroundColor: "#5c3d2e", color: "#fff", padding: "10px", borderRadius: "12px", border: "none", fontWeight: "600", cursor: "pointer" }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteProduct(p._id)} style={{ backgroundColor: "#ef4444", color: "#fff", padding: "10px", borderRadius: "12px", border: "none", fontWeight: "600", cursor: "pointer" }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;