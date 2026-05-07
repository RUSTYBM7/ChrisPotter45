import { useMutation } from "@tanstack/react-query";
import * as contactApi from "../api/contact";

/* ---------- MANAGEMENT ---------- */

export function useSubmitManagementInquiry() {
  return useMutation({
    mutationFn: (data: any) =>
      contactApi.submitManagement(data),
  });
}

/* ---------- FANBASE ---------- */

export function useSubmitFanbaseInquiry() {
  return useMutation({
    mutationFn: (data: any) =>
      contactApi.submitFanbase(data),
  });
}

/* ---------- CHARITY ---------- */

export function useSubmitCharityInquiry() {
  return useMutation({
    mutationFn: (data: any) =>
      contactApi.submitCharity(data),
  });
}

/* ---------- EVENT REGISTRATION ---------- */

export function useSubmitEventRegistration() {
  return useMutation({
    mutationFn: (data: any) =>
      contactApi.submitEventRegistration(data),
  });
}