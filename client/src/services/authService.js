import API from "../api/axios";

export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);

  // ✅ store token
  localStorage.setItem("token", res.data.token);

  // ✅ store full user info (includes isAdmin)
  localStorage.setItem("userInfo", JSON.stringify(res.data));

  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data;
};