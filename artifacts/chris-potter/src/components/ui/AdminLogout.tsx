import { useAdminLogout } from "../queries/admin";

export function AdminLogout() {
  const logout = useAdminLogout();

  return <button onClick={logout}>Logout</button>;
}