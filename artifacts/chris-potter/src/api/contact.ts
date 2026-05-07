const BASE = "/api/contact";

async function json(res: Response) {
  if (!res.ok) throw await res.json();
  return res.json();
}

export function submitManagement(data: any) {
  return json(fetch(`${BASE}/management`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

export function submitFanbase(data: any) {
  return json(fetch(`${BASE}/fanbase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

export function submitCharity(data: any) {
  return json(fetch(`${BASE}/charity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

export function submitEventRegistration(data: any) {
  return json(fetch(`${BASE}/event-registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}