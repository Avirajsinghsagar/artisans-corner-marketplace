import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AIRecommender from "../components/AIRecommender"; // ✅ AI CHATBOT
import { addToCart } from "../services/cartService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  const categories = ["All", "Pottery", "Decor", "Jewelry", "Paintings", "Gifts"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      setLoadingCartId(productId);
      await addToCart(productId, 1);
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Failed to add to cart");
    } finally {
      setLoadingCartId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "24px 32px" }}>

      {/* HERO SECTION */}
      <div style={{ backgroundColor: "#5c3d2e", color: "white", borderRadius: "24px", padding: "48px", marginBottom: "48px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "16px", lineHeight: "1.2" }}>
          Empowering Local Artisans Through Digital Commerce
        </h1>
        <p style={{ fontSize: "18px", color: "#e5d5c5", maxWidth: "600px", lineHeight: "1.8" }}>
          Discover handmade products crafted by talented small businesses and independent creators across India.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
          style={{ marginTop: "24px", backgroundColor: "white", color: "#5c3d2e", padding: "14px 28px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", border: "none", cursor: "pointer" }}
        >
          Explore Marketplace
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="Search handmade products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "360px", padding: "14px 20px", borderRadius: "16px", border: "2px solid #d6c5b5", fontSize: "16px", color: "#3e2c23", backgroundColor: "#fff", outline: "none" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{ padding: "10px 20px", borderRadius: "999px", fontWeight: "600", fontSize: "14px", border: "2px solid #5c3d2e", cursor: "pointer", backgroundColor: selectedCategory === cat ? "#5c3d2e" : "white", color: selectedCategory === cat ? "white" : "#5c3d2e", transition: "all 0.2s" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23" }}>Featured Handmade Products</h2>
        <p style={{ color: "#888" }}>{filteredProducts.length} Products</p>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p style={{ fontSize: "18px", color: "#5c3d2e" }}>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <div style={{ backgroundColor: "white", padding: "48px", borderRadius: "24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#5c3d2e", marginBottom: "8px" }}>No Products Found</h3>
          <p style={{ color: "#aaa" }}>Try another category or search keyword.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "32px" }}>
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate("/product/" + p._id)}
              style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"; }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ width: "100%", height: "240px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x240?text=No+Image"; }}
                />
                <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#b85c38", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: "600" }}>
                  {p.category || "Handmade"}
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "white", width: "38px", height: "38px", borderRadius: "50%", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  ❤️
                </button>
              </div>

              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#3e2c23", marginBottom: "4px" }}>{p.title}</h3>
                <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>by Local Artisan</p>
                <div style={{ marginBottom: "10px", color: "#f59e0b", fontSize: "14px" }}>
                  ⭐⭐⭐⭐⭐ <span style={{ color: "#aaa" }}>(4.8)</span>
                </div>
                <p style={{ fontSize: "22px", fontWeight: "800", color: "#b85c38", marginBottom: "16px" }}>₹{p.price}</p>
                <button
                  onClick={(e) => handleAddToCart(e, p._id)}
                  disabled={loadingCartId === p._id}
                  style={{ width: "100%", backgroundColor: loadingCartId === p._id ? "#aaa" : "#5c3d2e", color: "white", padding: "12px", borderRadius: "14px", border: "none", fontSize: "15px", fontWeight: "700", cursor: loadingCartId === p._id ? "not-allowed" : "pointer" }}
                >
                  {loadingCartId === p._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ AI SHOPPING CHATBOT — floating bottom right */}
      <AIRecommender />
    </div>
  );
}

export default Products;