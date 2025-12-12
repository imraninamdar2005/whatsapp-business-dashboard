import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Base API URL - change this to your FastAPI backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com/whatsapp';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          toast.error(data.detail || 'Validation error.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints
export const api = {
  // Health check
  healthCheck: () => apiClient.get('/'),
  
  // Auth endpoints (you'll need to implement these on your backend)
  auth: {
    login: (email: string, password: string) => 
      apiClient.post('/auth/login', { email, password }),
    register: (data: { email: string; password: string; name: string }) =>
      apiClient.post('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
    me: () => apiClient.get('/auth/me'),
    refreshToken: () => apiClient.post('/auth/refresh'),
  },
  
  // Contacts
  contacts: {
    getAll: (userId: string) => 
      apiClient.get(`/users?login_user=${userId}`),
    getById: (id: string) => 
      apiClient.get(`/users/${id}`),
    create: (data: ContactCreateInput) => 
      apiClient.post('/users', data),
    update: (id: string, data: Partial<ContactCreateInput>) => 
      apiClient.put(`/users/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`/users/${id}`),
    bulkDelete: (ids: string[]) => 
      apiClient.post('/users/bulk-delete', { ids }),
    importFromCSV: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post('/users/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    exportToCSV: () => 
      apiClient.get('/users/export', { responseType: 'blob' }),
  },
  
  // Tags
  tags: {
    getAll: () => apiClient.get('/tags'),
    create: (name: string) => apiClient.post('/tags', { name }),
    delete: (id: string) => apiClient.delete(`/tags/${id}`),
  },
  
  // Chats
  chats: {
    getHistory: (phoneNumber: string) => 
      apiClient.get(`/chats/${phoneNumber}`),
    sendMessage: (data: SendMessageInput) => 
      apiClient.post('/send', data),
    sendTemplate: (data: SendTemplateInput) =>
      apiClient.post('/send-template', data),
  },
  
  // Campaigns
  campaigns: {
    getAll: () => apiClient.get('/campaigns'),
    getById: (id: string) => apiClient.get(`/campaigns/${id}`),
    create: (data: CampaignCreateInput) => 
      apiClient.post('/campaigns', data),
    update: (id: string, data: Partial<CampaignCreateInput>) =>
      apiClient.put(`/campaigns/${id}`, data),
    delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
    getContacts: (campaignName: string) =>
      apiClient.get(`/campaign_contacts?campaign=${campaignName}`),
    getStatus: (campaignName: string) =>
      apiClient.get(`/${campaignName}`),
    pause: (id: string) => apiClient.post(`/campaigns/${id}/pause`),
    resume: (id: string) => apiClient.post(`/campaigns/${id}/resume`),
  },
  
  // Templates
  templates: {
    getAll: () => apiClient.get('/templates'),
    getById: (id: string) => apiClient.get(`/templates/${id}`),
  },
  
  // Sheets (Google Sheets integration)
  sheets: {
    getAll: () => apiClient.get('/sheets'),
    getNumbers: (sheetName: string) =>
      apiClient.get(`/imported_numbers?sheet_name=${sheetName}`),
  },
};

// Type definitions for API inputs
export interface ContactCreateInput {
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

export interface SendMessageInput {
  phone: string;
  message: string;
  mediaUrl?: string;
}

export interface SendTemplateInput {
  phone: string;
  templateId: string;
  parameters: Record<string, string>;
}

export interface CampaignCreateInput {
  name: string;
  templateId: string;
  sheetName?: string;
  contactIds?: string[];
  scheduledAt?: string;
}
