import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOtp: (phoneNumber: string) =>
    apiClient.post('/auth/send-otp', { phoneNumber }),
  verifyOtp: (phoneNumber: string, otp: number) =>
    apiClient.post('/auth/verify-otp', { phoneNumber, otp }),
  updateProfile: (userId: string, data: { mobileNumber?: string; name?: string }) =>
    apiClient.patch(`/auth/profile/${userId}`, data),
};

export const gymsAPI = {
  create: (data: { name: string; address: string; ownerId?: string }) =>
    apiClient.post('/gyms', data),
  getAll: () => apiClient.get('/gyms'),
  getMyOwned: () => apiClient.get('/gyms/me/owned'),
  getById: (id: string) => apiClient.get(`/gyms/${id}`),
  update: (id: string, data: { name?: string; address?: string }) =>
    apiClient.put(`/gyms/${id}`, data),
  delete: (id: string) => apiClient.delete(`/gyms/${id}`),
};

export const plansAPI = {
  create: (data: {
    gymId: string;
    name: string;
    description?: string;
    durationValue: number;
    durationUnit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
    price: number
  }) => apiClient.post('/plans', data),
  getByGymId: (gymId: string) => apiClient.get(`/plans?gymId=${gymId}`),
  getById: (id: string) => apiClient.get(`/plans/${id}`),
  update: (id: string, data: Partial<{
    name: string;
    description: string;
    durationValue: number;
    durationUnit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
    price: number;
    isActive: boolean;
  }>) => apiClient.put(`/plans/${id}`, data),
  delete: (id: string) => apiClient.delete(`/plans/${id}`),
};

export default apiClient;