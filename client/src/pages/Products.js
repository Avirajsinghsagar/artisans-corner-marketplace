import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { addToCart } from "../services/cartService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCartId, setLoadingCartId] = useState(null);

  const navigate = useNavigate();

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
      alert("Added to cart ✅");
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Failed to add to cart ❌");
    } finally {
      setLoadingCartId(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${p._id}`)}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "6px",
              maxWidth: "300px",
              cursor: "pointer",
            }}
          >
            {/* ✅ FORCE YOUR LOCAL IMAGE */}
            <img
              src="/images/images.jpg"
              alt={p.title}
              width="150"
              style={{
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            <h3>{p.title}</h3>
            <p>₹{p.price}</p>

            <button
              onClick={(e) => handleAddToCart(e, p._id)}
              disabled={loadingCartId === p._id}
            >
              {loadingCartId === p._id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Products;