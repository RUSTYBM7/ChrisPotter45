import { useEffect } from "react";
import { getAdminToken } from "./adminSession";
import { useQueryClient } from "@tanstack/react-query";

export function useHydrateAdminSession() {
  const qc = useQueryClient();

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      // Trigger admin queries lazily when needed
      qc.invalidateQueries({ queryKey: ["admin"] });
    }
  }, [qc]);
}