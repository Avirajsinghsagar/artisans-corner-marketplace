import { useState } from "react";
import API from "../api/axios";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null); // ⭐ HERE

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", imageFile); // ⭐ IMPORTANT

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product created ✅");
    } catch (err) {
      console.error(err);
      alert("Product creation failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Product</h2>
  
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />
  
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />
  
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <br /><br />
  
        {/* ⭐ MOST IMPORTANT INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <br /><br />
  
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default AddProduct;  