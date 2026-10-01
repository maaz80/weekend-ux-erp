import { Navigate, Outlet } from "react-router-dom";
import { isErpAuthenticated } from "../utils/auth.js";

export default function ProtectedRoute({ children }) {
  const isAuth = isErpAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}
