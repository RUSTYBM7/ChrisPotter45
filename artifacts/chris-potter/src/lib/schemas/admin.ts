import { z } from "zod";

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