import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  let userInfo = null;

  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
  } catch (err) {
    userInfo = null;
  }

  // ✅ only check login
  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;