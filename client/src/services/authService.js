import API from "../api/axios";

export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);

  // ✅ FIXED: res.data = { token, user: {...} }
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userInfo", JSON.stringify(res.data.user));

  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data;
};