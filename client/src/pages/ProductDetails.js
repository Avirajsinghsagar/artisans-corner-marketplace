import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get("/products/" + id);
      setProduct(res.data);
    } catch (err) {
      console.error("Product fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews/" + id);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(id, 1);
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      setSubmitting(true);
      await API.post(
        "/reviews/" + id,
        { rating, comment },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Review added!");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  const starLabel = (n) => "⭐".repeat(n);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "20px", color: "#5c3d2e" }}>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "20px", color: "#5c3d2e" }}>Product not found</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", padding: "32px" }}>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "transparent",
          border: "2px solid #5c3d2e",
          color: "#5c3d2e",
          padding: "10px 20px",
          borderRadius: "12px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "32px",
          fontSize: "14px",
        }}
      >
        ← Back
      </button>

      {/* PRODUCT CARD */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
        marginBottom: "48px",
      }}>

        {/* LEFT - IMAGE */}
        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            alt={product.title}
            style={{ width: "100%", height: "500px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x500?text=No+Image";
            }}
          />
          {/* CATEGORY BADGE */}
          <div style={{
            position: "absolute", top: "16px", left: "16px",
            backgroundColor: "#b85c38", color: "white",
            padding: "6px 16px", borderRadius: "999px",
            fontWeight: "600", fontSize: "13px"
          }}>
            {product.category}
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div style={{ padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#3e2c23", marginBottom: "8px" }}>
            {product.title}
          </h1>

          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
            by {product.seller?.name || "Local Artisan"}
          </p>

          {/* RATING */}
          <div style={{ marginBottom: "20px", fontSize: "18px" }}>
            ⭐⭐⭐⭐⭐
            <span style={{ color: "#aaa", fontSize: "14px", marginLeft: "8px" }}>
              ({reviews.length} reviews)
            </span>
          </div>

          {/* PRICE */}
          <p style={{ fontSize: "42px", fontWeight: "800", color: "#b85c38", marginBottom: "24px" }}>
            ₹{product.price}
          </p>

          {/* DESCRIPTION */}
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "36px" }}>
            {product.description}
          </p>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            style={{
              backgroundColor: adding ? "#aaa" : "#5c3d2e",
              color: "white",
              padding: "18px 32px",
              borderRadius: "16px",
              border: "none",
              fontSize: "18px",
              fontWeight: "700",
              cursor: adding ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => { if (!adding) e.target.style.backgroundColor = "#3e2c23"; }}
            onMouseOut={(e) => { if (!adding) e.target.style.backgroundColor = "#5c3d2e"; }}
          >
            {adding ? "Adding to Cart..." : "🛒 Add to Cart"}
          </button>

        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}>

        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#3e2c23", marginBottom: "32px" }}>
          Customer Reviews
        </h2>

        {/* WRITE REVIEW */}
        <div style={{
          backgroundColor: "#f8f5f0",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "36px",
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#3e2c23", marginBottom: "20px" }}>
            Write a Review
          </h3>

          {/* STAR RATING */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#5c3d2e", fontWeight: "600", fontSize: "14px", display: "block", marginBottom: "8px" }}>
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #d6c5b5",
                fontSize: "16px",
                color: "#3e2c23",
                backgroundColor: "white",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {starLabel(r)} {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* COMMENT */}
          <textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "2px solid #d6c5b5",
              fontSize: "16px",
              color: "#3e2c23",
              backgroundColor: "white",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "16px",
            }}
          />

          <button
            onClick={submitReview}
            disabled={submitting}
            style={{
              backgroundColor: submitting ? "#aaa" : "#5c3d2e",
              color: "white",
              padding: "14px 32px",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
              fontWeight: "700",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* REVIEWS LIST */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px", color: "#aaa" }}>
            <p style={{ fontSize: "18px" }}>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviews.map((rev) => (
              <div
                key={rev._id}
                style={{
                  border: "2px solid #f0e8df",
                  padding: "20px",
                  borderRadius: "16px",
                  backgroundColor: "#fdfaf7",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong style={{ color: "#3e2c23", fontSize: "16px" }}>
                    {rev.user?.name || "Anonymous"}
                  </strong>
                  <span style={{ color: "#f59e0b", fontSize: "16px" }}>
                    {"⭐".repeat(rev.rating)}
                  </span>
                </div>
                <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.6" }}>
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;