import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles, requiredPermission }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}