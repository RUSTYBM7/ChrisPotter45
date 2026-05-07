const KEY = "cp_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(KEY);
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}
Usage
const login = useAdminLogin();

login.mutate(password, {
  onSuccess: (res) => setAdminToken(res.data.token),
});
function logout() {
  clearAdminToken();
  queryClient.clear();
}