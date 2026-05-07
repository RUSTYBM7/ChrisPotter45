import { useState } from "react";
import { useAdminLogin } from "../../queries/admin";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
      />
      <button
        onClick={() => login.mutate(password)}
        disabled={login.isPending}
      >
        {login.isPending ? "Logging in…" : "Login"}
      </button>

      {login.isError && (
        <p style={{ color: "red" }}>
          {(login.error as any)?.message ?? "Login failed"}
        </p>
      )}
    </div>
  );
}
