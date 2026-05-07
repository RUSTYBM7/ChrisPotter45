import { parseJson } from "./http";
import type {
  ApiResponse,
  AdminStats,
  Subscriber,
  Contact,
  VipRequest,
} from "./types";

const BASE = "/api/admin";

/* ---------------- AUTH ---------------- */

export function adminLogin(password: string) {
  return fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  }).then((res) =>
    parseJson<ApiResponse<{ token: string }>>(res)
  );
}

/* ---------------- DASHBOARD ---------------- */

export function getAdminStats(token: string) {
  return fetch(`${BASE}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) =>
    parseJson<ApiResponse<AdminStats>>(res)
  );
}

/* ---------------- SUBSCRIBERS ---------------- */

export function listSubscribers(
  token: string,
  params?: { search?: string; tag?: string },
) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return fetch(`${BASE}/subscribers${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) =>
    parseJson<ApiResponse<Subscriber[]>>(res)
  );
}

export function updateSubscriber(
  token: string,
  data: Partial<Subscriber> & { email: string },
) {
  return fetch(`${BASE}/subscribers`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) =>
    parseJson<ApiResponse<Subscriber>>(res)
  );
}

export function deleteSubscriber(token: string, email: string) {
  return fetch(`${BASE}/subscribers`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  }).then((res) =>
    parseJson<ApiResponse<null>>(res)
  );
}

/* ---------------- CONTACTS ---------------- */

export function listContacts(
  token: string,
  params?: { type?: string; status?: string; search?: string },
) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return fetch(`${BASE}/contacts${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) =>
    parseJson<ApiResponse<Contact[]>>(res)
  );
}

export function updateContact(
  token: string,
  id: string,
  data: { status?: string; notes?: string },
) {
  return fetch(`${BASE}/contacts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) =>
    parseJson<ApiResponse<Contact>>(res)
  );
}

/* ---------------- VIP ---------------- */

export function listVip(
  token: string,
  params?: { status?: string; type?: string },
) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return fetch(`${BASE}/vip${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) =>
    parseJson<ApiResponse<VipRequest[]>>(res)
  );
}

export function updateVip(
  token: string,
  id: string,
  data: {
    status?: string;
    notes?: string;
    scheduledDate?: string | null;
  },
) {
  return fetch(`${BASE}/vip/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) =>
    parseJson<ApiResponse<VipRequest>>(res)
  );
}

/* ---------------- COMPOSE EMAIL ---------------- */

export function sendAdminEmail(
  token: string,
  payload: {
    to: "all" | "badge" | "management" | "vip" | string | string[];
    subject: string;
    html: string;
    text?: string;
  },
) {
  return fetch(`${BASE}/compose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then((res) =>
    parseJson<ApiResponse<{ sent: number; failed: number }>>(res)
  );
}

/* ---------------- EXPORT ---------------- */

export function exportAdminData(
  token: string,
  type?: "contacts",
) {
  const qs = type ? `?type=${type}` : "";
  return fetch(`${BASE}/export${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}