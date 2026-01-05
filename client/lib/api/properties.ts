import apiClient from "@/lib/api/client";
import { Property } from "@/components/features/properties/types/property";

export const propertyApi = {
  getAll: async (params?: URLSearchParams) => {
    return apiClient.get<Property[]>("/properties", { params });
  },

  getById: async (id: string) => {
    return apiClient.get<Property>(`/properties/${id}`);
  },

  

  getByAgentId: async (id: string) => {
    return apiClient.get<Property>(`/properties/agent/${id}`);
  },

  create: async (data: FormData) => {
    return apiClient.post<Property>("/properties", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: async (id: string, data: Partial<Property>) => {
    return apiClient.patch<Property>(`/properties/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/properties/${id}`);
  },
};
