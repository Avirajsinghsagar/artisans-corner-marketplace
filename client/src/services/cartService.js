import API from "../api/axios";

export const getMyCart = async () => {
  const res = await API.get("/cart");
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await API.post("/cart", { productId, quantity });
  return res.data;
};

export const updateCartItem = async (productId, quantity) => {
  const res = await API.put("/cart/update", {
    productId,
    quantity,
  });
  return res.data;
};

export const removeCartItem = async (productId) => {
  const res = await API.delete(`/cart/remove/${productId}`);
  return res.data;
};