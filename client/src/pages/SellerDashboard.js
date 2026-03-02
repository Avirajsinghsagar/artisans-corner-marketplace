import { useEffect, useState } from "react";
import API from "../api/axios";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ fetch seller products
  const fetchMyProducts = async () => {
    try {
      const res = await API.get("/products/my-products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load seller products", err);
    }
  };

  // ✅ fetch seller stats
  const fetchStats = async () => {
    try {
      const res = await API.get("/seller/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error", err);
    }
  };

  // ✅ delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchMyProducts();
      fetchStats();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ load everything
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchMyProducts(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Seller Dashboard</h2>

      {/* 🔥 Stats Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div className="card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>

      {/* 📦 Product List */}
      <h3>My Products</h3>

      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.countInStock ?? p.stock ?? "-"}</td>
                <td>
                  <button onClick={() => deleteProduct(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SellerDashboard;