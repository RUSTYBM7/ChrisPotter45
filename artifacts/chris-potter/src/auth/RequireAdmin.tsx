import { Navigate } from "react-router-dom";
import { getAdminToken } from "./adminSession";

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}