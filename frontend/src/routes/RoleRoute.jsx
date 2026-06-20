import ProtectedRoute from "./ProtectedRoute";

const RoleRoute = ({ children, role }) => {
  return <ProtectedRoute requiredRole={role}>{children}</ProtectedRoute>;
};

export default RoleRoute;
