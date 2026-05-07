import { clearAdminToken } from "../auth/adminSession";
import { queryClient } from "../queryClient";

export function AdminLogout() {
  function logout() {
    clearAdminToken();
    queryClient.clear(); // ✅ remove cached admin data
  }

  return <button onClick={logout}>Log out</button>;
}