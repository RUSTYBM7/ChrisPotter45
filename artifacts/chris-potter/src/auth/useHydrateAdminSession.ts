import { useEffect } from "react";
import { getAdminToken } from "./adminSessions";
import { useQueryClient } from "@tanstack/react-query";

export function useHydrateAdminSession() {
  const qc = useQueryClient();

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      qc.invalidateQueries({ queryKey: ["admin"] });
    }
  }, [qc]);
}
