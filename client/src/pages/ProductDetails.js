import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ FETCH ON LOAD
  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line
  }, [id]);

  // =========================
  // ✅ FETCH PRODUCT
  // =========================
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Product fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  // =========================
  // ✅ ADD TO CART
  // =========================
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(id, 1);
      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart ❌");
    } finally {
      setAdding(false);
    }
  };

  // =========================
  // ✅ SUBMIT REVIEW (FIXED TOKEN ISSUE)
  // =========================
  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first ⚠️");
      return;
    }

    try {
      setSubmitting(true);

      await API.post(
        `/reviews/${id}`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review added ✅");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Review error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Review failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // ✅ IMAGE HANDLER (FIXED)
  // =========================
  const getImageUrl = () => {
    if (!product?.image) return "/images/images.jpg";

    // if already full URL (future cloudinary)
    if (product.image.startsWith("http")) return product.image;

    // local fallback
    return "/images/images.jpg";
  };

  // =========================
  // ✅ UI STATES
  // =========================
  if (loading) return <p style={{ padding: 20 }}>Loading product...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.title}</h2>

      {/* ✅ FIXED IMAGE */}
      <img
        src={getImageUrl()}
        alt={product.title}
        width="250"
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />

      <p style={{ marginTop: 10 }}>{product.description}</p>
      <h3>₹{product.price}</h3>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        style={{ marginTop: 10 }}
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>

      {/* ⭐ REVIEW FORM */}
      <hr style={{ margin: "30px 0" }} />
      <h3>Write a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star
          </option>
        ))}
      </select>

      <br />

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "300px", height: "80px", marginTop: 10 }}
      />

      <br />

      <button
        onClick={submitReview}
        disabled={submitting}
        style={{ marginTop: 10 }}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

      {/* ⭐ REVIEWS LIST */}
      <hr style={{ margin: "30px 0" }} />
      <h3>Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((rev) => (
          <div
            key={rev._id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              margin: "10px 0",
              borderRadius: "6px",
            }}
          >
            <strong>{rev.user?.name || "User"}</strong>
            <p>⭐ {rev.rating} / 5</p>
            <p>{rev.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductDetails;