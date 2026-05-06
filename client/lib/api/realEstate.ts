import apiClient from "@/lib/api/client";
import { Property } from "@/components/features/properties/types/property";

export type InquiryStatus = "new" | "contacted" | "closed";
export type VisitStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "rescheduled"
  | "completed"
  | "cancelled";
export type ReportStatus = "open" | "in_review" | "resolved" | "rejected";

export interface Inquiry {
  _id: string;
  property: {
    _id: string;
    title: string;
    status: string;
    price: number;
    address?: { city?: string; state?: string };
  };
  requester?: { _id: string; name: string; email: string; phone?: string };
  agent?: { _id: string; name: string; email: string; phone?: string };
  message: string;
  contactEmail?: string;
  contactPhone?: string;
  status: InquiryStatus;
  statusNote?: string;
  createdAt: string;
}

export interface Visit {
  _id: string;
  property: {
    _id: string;
    title: string;
    status: string;
    price: number;
    address?: { city?: string; state?: string };
  };
  requester?: { _id: string; name: string; email: string; phone?: string };
  agent?: { _id: string; name: string; email: string; phone?: string };
  requestedStartAt: string;
  requestedEndAt: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  status: VisitStatus;
  requesterNote?: string;
  agentNote?: string;
  decisionReason?: string;
  createdAt: string;
}

export interface SavedSearch {
  _id: string;
  name: string;
  filters: Record<string, unknown>;
  isAlertEnabled: boolean;
  frequency: "instant" | "daily" | "weekly";
  isActive: boolean;
  lastRunAt?: string;
  lastAlertAt?: string;
  lastResultCount: number;
  createdAt: string;
}

export interface ReportItem {
  _id: string;
  targetType: "property" | "user" | "review";
  targetId: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  resolutionNote?: string;
  reporter?: { _id: string; name: string; email: string; role: string };
  reviewedBy?: { _id: string; name: string; email: string; role: string };
}

export interface ReviewItem {
  _id: string;
  user: { _id: string; name: string; profileImage?: string };
  property: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}

interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export const realEstateApi = {
  createInquiry: async (payload: {
    propertyId: string;
    message: string;
    contactEmail?: string;
    contactPhone?: string;
  }) => {
    const response = await apiClient.post<ApiItemResponse<Inquiry>>("/inquiries", payload);
    return response.data.data;
  },

  getMyInquiries: async () => {
    const response = await apiClient.get<ApiListResponse<Inquiry>>("/inquiries/me");
    return response.data.data;
  },

  getAssignedInquiries: async () => {
    const response = await apiClient.get<ApiListResponse<Inquiry>>("/inquiries/assigned");
    return response.data.data;
  },

  updateInquiryStatus: async (id: string, status: InquiryStatus, statusNote?: string) => {
    const response = await apiClient.patch<ApiItemResponse<Inquiry>>(`/inquiries/${id}/status`, {
      status,
      statusNote,
    });
    return response.data.data;
  },

  createVisit: async (payload: {
    propertyId: string;
    requestedStartAt: string;
    requestedEndAt: string;
    requesterNote?: string;
  }) => {
    const response = await apiClient.post<ApiItemResponse<Visit>>("/visits", payload);
    return response.data.data;
  },

  getMyVisits: async () => {
    const response = await apiClient.get<ApiListResponse<Visit>>("/visits/me");
    return response.data.data;
  },

  getAssignedVisits: async () => {
    const response = await apiClient.get<ApiListResponse<Visit>>("/visits/assigned");
    return response.data.data;
  },

  updateVisitStatus: async (
    id: string,
    payload: {
      status: VisitStatus;
      scheduledStartAt?: string;
      scheduledEndAt?: string;
      agentNote?: string;
      decisionReason?: string;
    }
  ) => {
    const response = await apiClient.patch<ApiItemResponse<Visit>>(`/visits/${id}/status`, payload);
    return response.data.data;
  },

  createSavedSearch: async (payload: {
    name: string;
    filters: Record<string, unknown>;
    isAlertEnabled?: boolean;
    frequency?: "instant" | "daily" | "weekly";
  }) => {
    const response = await apiClient.post<ApiItemResponse<SavedSearch>>("/saved-searches", payload);
    return response.data.data;
  },

  getSavedSearches: async () => {
    const response = await apiClient.get<ApiListResponse<SavedSearch>>("/saved-searches");
    return response.data.data;
  },

  updateSavedSearch: async (
    id: string,
    payload: Partial<{
      name: string;
      filters: Record<string, unknown>;
      isAlertEnabled: boolean;
      frequency: "instant" | "daily" | "weekly";
      isActive: boolean;
    }>
  ) => {
    const response = await apiClient.put<ApiItemResponse<SavedSearch>>(`/saved-searches/${id}`, payload);
    return response.data.data;
  },

  deleteSavedSearch: async (id: string) => {
    await apiClient.delete(`/saved-searches/${id}`);
  },

  runSavedSearch: async (id: string) => {
    const response = await apiClient.post<
      ApiItemResponse<{ savedSearch: SavedSearch; matches: unknown[]; count: number }>
    >(`/saved-searches/${id}/run`);
    return response.data.data;
  },

  createReport: async (payload: {
    targetType: "property" | "user" | "review";
    targetId: string;
    reason:
      | "spam"
      | "fraud"
      | "misleading_information"
      | "offensive_content"
      | "duplicate_listing"
      | "other";
    description?: string;
  }) => {
    const response = await apiClient.post<ApiItemResponse<ReportItem>>("/admin/reports", payload);
    return response.data.data;
  },

  getReports: async (status?: ReportStatus) => {
    const response = await apiClient.get<{ success: boolean; data: ReportItem[] }>("/admin/reports", {
      params: status ? { status } : {},
    });
    return response.data.data;
  },

  updateReportStatus: async (id: string, status: ReportStatus, resolutionNote?: string) => {
    const response = await apiClient.patch<ApiItemResponse<ReportItem>>(
      `/admin/reports/${id}/status`,
      { status, resolutionNote }
    );
    return response.data.data;
  },

  getAdminDashboardSummary: async () => {
    const response = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
      "/admin/dashboard/summary"
    );
    return response.data.data;
  },

  getAdminUsers: async (params?: { role?: "user" | "agent" | "admin"; page?: number; limit?: number }) => {
    const response = await apiClient.get<{ success: boolean; data: AdminUserItem[]; pagination: any }>(
      "/admin/users",
      { params }
    );
    return response.data;
  },

  updateAdminUserStatus: async (userId: string, isActive: boolean, note?: string) => {
    const response = await apiClient.patch<{ success: boolean; data: AdminUserItem }>(
      `/admin/users/${userId}/status`,
      { isActive, note }
    );
    return response.data.data;
  },

  getAdminProperties: async (params?: {
    moderationStatus?: "pending" | "approved" | "rejected";
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<{ success: boolean; data: Property[]; pagination: any }>(
      "/admin/properties",
      { params }
    );
    return response.data;
  },

  moderateProperty: async (
    propertyId: string,
    moderationStatus: "pending" | "approved" | "rejected",
    moderationNotes?: string
  ) => {
    const response = await apiClient.patch<{ success: boolean; data: Property }>(
      `/admin/properties/${propertyId}/moderate`,
      { moderationStatus, moderationNotes }
    );
    return response.data.data;
  },

  getPropertyReviews: async (propertyId: string) => {
    const response = await apiClient.get<{ success: boolean; data: ReviewItem[] }>(
      `/properties/${propertyId}/reviews`
    );
    return response.data.data;
  },

  createPropertyReview: async (propertyId: string, payload: { rating: number; comment: string }) => {
    const response = await apiClient.post<{ success: boolean; data: ReviewItem }>(
      `/properties/${propertyId}/reviews`,
      payload
    );
    return response.data.data;
  },

  updatePropertyReview: async (
    propertyId: string,
    reviewId: string,
    payload: Partial<{ rating: number; comment: string }>
  ) => {
    const response = await apiClient.patch<{ success: boolean; data: ReviewItem }>(
      `/properties/${propertyId}/reviews/${reviewId}`,
      payload
    );
    return response.data.data;
  },

  deletePropertyReview: async (propertyId: string, reviewId: string) => {
    await apiClient.delete(`/properties/${propertyId}/reviews/${reviewId}`);
  },

  reportPropertyReview: async (propertyId: string, reviewId: string, reason: string) => {
    const response = await apiClient.post<{ success: boolean; data: unknown }>(
      `/properties/${propertyId}/reviews/${reviewId}/report`,
      { reason }
    );
    return response.data.data;
  },

  dispatchCommunication: async (payload: {
    channel: "email" | "whatsapp";
    recipient: string;
    subject?: string;
    message: string;
    context?: Record<string, unknown>;
  }) => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
      "/communications/dispatch",
      payload
    );
    return response.data.data;
  },

  generateWhatsappLink: async (phone: string, text: string) => {
    const response = await apiClient.post<{ success: boolean; data: { link: string } }>(
      "/communications/whatsapp-link",
      { phone, text }
    );
    return response.data.data.link;
  },

  getNotificationPreferences: async () => {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      "/advanced/notifications/preferences"
    );
    return response.data.data;
  },

  updateNotificationPreferences: async (payload: {
    emailDigest?: "instant" | "daily" | "weekly";
    pushEnabled?: boolean;
    smsEnabled?: boolean;
  }) => {
    const response = await apiClient.put<{ success: boolean; data: any }>(
      "/advanced/notifications/preferences",
      payload
    );
    return response.data.data;
  },

  getChatThreads: async () => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>("/advanced/chat/threads");
    return response.data.data;
  },

  createChatThread: async (payload: {
    participants: string[];
    propertyId?: string;
    initialMessage?: string;
  }) => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
      "/advanced/chat/threads",
      payload
    );
    return response.data.data;
  },

  escalateChatThread: async (threadId: string) => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
      `/advanced/chat/threads/${threadId}/escalate`
    );
    return response.data.data;
  },

  runRiskScan: async () => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
      "/advanced/risk-flags/scan"
    );
    return response.data.data;
  },

  getRiskFlags: async () => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(
      "/advanced/risk-flags"
    );
    return response.data.data;
  },

  getGeoRecommendations: async (lat: number, lng: number) => {
    const response = await apiClient.get<{ success: boolean; data: Property[] }>(
      "/advanced/geo/recommendations",
      { params: { lat, lng } }
    );
    return response.data.data;
  },
};
