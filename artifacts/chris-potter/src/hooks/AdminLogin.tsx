import { useAdminLogin } from "../queries/admin";
import { setAdminToken } from "../auth/adminSessions";
import type { ApiSuccess } from "../api/types";

export function AdminLogin() {
  const login = useAdminLogin();

  function handleLogin(password: string) {
    login.mutate(password, {
      onSuccess: (res) => {
        if (res.success) {
          setAdminToken((res as ApiSuccess<{ token: string }>).data!.token);
        }
      },
    });
  }

  return (
    <button onClick={() => handleLogin("secret")}>
      Log in
    </button>
  );
}
