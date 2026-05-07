import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "../api/admin";
import type { Subscriber, Contact, VipRequest } from "../api/types";

/* ---------- AUTH ---------- */

export function useAdminLogin() {
  return useMutation({
    mutationFn: adminApi.adminLogin,
  });
}

/* ---------- DASHBOARD ---------- */

export function useAdminStats(token: string) {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getAdminStats(token),
    enabled: !!token,
  });
}

/* ---------- SUBSCRIBERS ---------- */

export function useSubscribers(token: string, params?: { search?: string; tag?: string }) {
  return useQuery({
    queryKey: ["admin", "subscribers", params],
    queryFn: () => adminApi.listSubscribers(token, params),
    enabled: !!token,
  });
}

export function useUpdateSubscriber(token: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Subscriber> & { email: string }) =>
      adminApi.updateSubscriber(token, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "subscribers"] });
    },
  });
}

export function useDeleteSubscriber(token: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      adminApi.deleteSubscriber(token, email),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "subscribers"] });
    },
  });
}

/* ---------- CONTACTS ---------- */

export function useContacts(
  token: string,
  params?: { type?: string; status?: string; search?: string },
) {
  return useQuery({
    queryKey: ["admin", "contacts", params],
    queryFn: () => adminApi.listContacts(token, params),
    enabled: !!token,
  });
}

export function useUpdateContact(token: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateContact(token, id, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contacts"] });
    },
  });
}

/* ---------- VIP ---------- */

export function useVip(token: string, params?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ["admin", "vip", params],
    queryFn: () => adminApi.listVip(token, params),
    enabled: !!token,
  });
}

export function useUpdateVip(token: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateVip(token, id, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "vip"] });
    },
  });
}

/* ---------- COMPOSE ---------- */

export function useSendAdminEmail(token: string) {
  return useMutation({
    mutationFn: (payload: any) =>
      adminApi.sendAdminEmail(token, payload),
  });
}

---
