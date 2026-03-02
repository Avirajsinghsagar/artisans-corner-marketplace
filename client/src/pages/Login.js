import { useState } from "react";
import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("LOGIN CLICKED");

    try {
      const data = await loginUser({ email, password });
      console.log("LOGIN RESPONSE:", data);

      // ✅ MUST: store token
      localStorage.setItem("token", data.token);

      // ✅ MUST: store user (YOU WERE MISSING THIS)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ optional cleanup
      setPassword("");

      alert("Login successful ✅");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;