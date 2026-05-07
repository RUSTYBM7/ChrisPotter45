const BASE = "/api/auth";

async function json(res: Response) {
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function requestMagicLink(email: string) {
  return json(await fetch(`${BASE}/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }));
}

export async function verifyMagicLink(token: string) {
  return json(await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  }));
}
