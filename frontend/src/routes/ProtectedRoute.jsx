import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/authService";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, authReady } = useAuth();
  const token = getToken();

  if (!authReady) {
    return null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
