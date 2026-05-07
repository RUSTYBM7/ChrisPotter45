const BASE = "/api/newsletter";

async function json(res: Response) {
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function subscribe(email: string, name?: string) {
  return json(fetch(`${BASE}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  }));
}

export async function unsubscribe(email: string) {
  return json(fetch(`${BASE}/unsubscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }));
}
