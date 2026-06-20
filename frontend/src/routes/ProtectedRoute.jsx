import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const token = getToken();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
