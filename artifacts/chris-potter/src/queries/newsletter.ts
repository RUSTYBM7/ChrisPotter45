import { useMutation } from "@tanstack/react-query";
import * as newsletterApi from "../api/newsletter";

/* ---------- SUBSCRIBE ---------- */

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: ({ email, name }: { email: string; name?: string }) =>
      newsletterApi.subscribe(email, name),
  });
}

/* ---------- UNSUBSCRIBE ---------- */

export function useUnsubscribeNewsletter() {
  return useMutation({
    mutationFn: (email: string) =>
      newsletterApi.unsubscribe(email),
  });
}
Usage:
const subscribe = useSubscribeNewsletter();

subscribe.mutate(
  { email, name },
  { onSuccess: () => toast.success("Subscribed!") }
);