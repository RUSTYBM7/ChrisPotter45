import { useQueryClient } from "@tanstack/react-query";
import { clearAdminToken } from "../auth/adminSessions";

export function AdminLogout() {
  const qc = useQueryClient();

  function logout() {
    clearAdminToken();
    qc.clear();
  }

  return <button onClick={logout}>Log out</button>;
}
