const BASE = "/api/contact";

async function json(res: Response) {
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function submitManagement(data: any) {
  return json(await fetch(`${BASE}/management`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

export async function submitFanbase(data: any) {
  return json(await fetch(`${BASE}/fanbase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

export async function submitCharity(data: any) {
  return json(await fetch(`${BASE}/charity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

export async function submitEventRegistration(data: any) {
  return json(await fetch(`${BASE}/event-registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}
