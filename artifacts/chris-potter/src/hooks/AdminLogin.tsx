import { useAdminLogin } from "../queries/admin";
import { setAdminToken } from "../auth/adminSession";

export function AdminLogin() {
  const login = useAdminLogin();

  function handleLogin(password: string) {
    login.mutate(password, {
      onSuccess: (res) => {
        // ✅ token persistence happens HERE
        setAdminToken(res.data.token);
      },
    });
  }

  return (
    <button onClick={() => handleLogin("secret")}>
      Log in
    </button>
  );
}