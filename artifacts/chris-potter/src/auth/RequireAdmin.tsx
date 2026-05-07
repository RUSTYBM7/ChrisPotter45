import { Redirect } from "wouter";
import type { ReactNode } from "react";
import { getAdminToken } from "./adminSessions";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const token = getAdminToken();

  if (!token) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
