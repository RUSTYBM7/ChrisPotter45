const BASE = "/api/event";

async function json(res: Response) {
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getEventCounts() {
  return json(fetch(BASE));
}