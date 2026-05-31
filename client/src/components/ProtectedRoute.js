import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // ✅ FIXED: check token separately, not inside userInfo
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;