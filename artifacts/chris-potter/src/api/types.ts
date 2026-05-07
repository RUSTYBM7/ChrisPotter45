// ---- shared primitives ----

export type ApiSuccess<T> = {
  success: true;
  data?: T;
  message?: string;
};

export type ApiError = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---- auth ----

export interface MagicLinkRequestResponse {
  success: true;
  message: string;
}

export interface MagicLinkVerifyResponse {
  success: true;
  email: string;
  sessionToken: string;
}

// ---- admin ----

export interface AdminStats {
  subscribers: number;
  newThisWeek: number;
  totalContacts: number;
  pendingContacts: number;
  vipRequests: number;
  pendingVip: number;
  managementInquiries: number;
  badgeApplications: number;
}

export interface Subscriber {
  email: string;
  name?: string;
  phone?: string;
  subscribedAt: string;
  tags?: string[];
  notes?: string;
}

export interface Contact {
  id: string;
  type: string;
  email: string;
  status: string;
  receivedAt: string;
  notes?: string;
}

export interface VipRequest {
  id: string;
  email: string;
  sessionType: string;
  status: string;
  requestedAt: string;
  scheduledDate?: string | null;
  notes?: string;
}

// ---- newsletter ----

export interface NewsletterSubscribeResponse {
  success: true;
  message: string;
}

// ---- events ----