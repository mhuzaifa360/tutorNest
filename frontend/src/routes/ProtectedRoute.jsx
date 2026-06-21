import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/authService";

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();
  const token = getToken();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
