import { z } from "zod";

/* ---------- ADMIN ---------- */

export const AdminStatsSchema = z.object({
  subscribers: z.number(),
  newThisWeek: z.number(),
  totalContacts: z.number(),
  pendingContacts: z.number(),
  vipRequests: z.number(),
  pendingVip: z.number(),
  managementInquiries: z.number(),
  badgeApplications: z.number(),
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;

/* ---------- SUBSCRIBER ---------- */

export const SubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  subscribedAt: z.string(),
  tags: z.array(z.string()).optional(),
});