const BASE = "/api/admin";

async function json(res: Response) {
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function adminLogin(password: string) {
  return json(fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  }));
}

export async function getAdminStats(token: string) {
  return json(fetch(`${BASE}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  }));
}

export async function listSubscribers(token: string, params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return json(fetch(`${BASE}/subscribers${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  }));
}

export async function updateSubscriber(token: string, data: any) {
  return json(fetch(`${BASE}/subscribers`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }));
}

export async function deleteSubscriber(token: string, email: string) {
  return json(fetch(`${BASE}/subscribers`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  }));
}

export async function listContacts(token: string, params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return json(fetch(`${BASE}/contacts${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  }));
}

export async function updateContact(token: string, id: string, data: any) {
  return json(fetch(`${BASE}/contacts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }));
}

export async function listVip(token: string, params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return json(fetch(`${BASE}/vip${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  }));
}

export async function updateVip(token: string, id: string, data: any) {
  return json(fetch(`${BASE}/vip/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }));
}

export async function sendAdminEmail(
  token: string,
  payload: { to: string | string[]; subject: string; html: string; text?: string },
) {
  return json(fetch(`${BASE}/compose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }));
}

export function exportAdminData(token: string, type?: "contacts") {
  const qs = type ? `?type=${type}` : "";
  return fetch(`${BASE}/export${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}