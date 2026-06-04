import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleRoute;