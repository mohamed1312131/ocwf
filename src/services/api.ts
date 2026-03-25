import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('omnicare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'PATIENT' | 'PROFESSIONAL' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface PreInscriptionRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profession: 'MEDECIN' | 'INFIRMIER' | 'PSYCHOLOGUE' | 'KINESITHERAPEUTE';
}

export interface PreInscriptionResponse {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profession: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: string;
  readAt?: string;
}

export interface StatisticsResponse {
  total: number;
  medecin: number;
  infirmier: number;
  psychologue: number;
  kinesitherapeute: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const authAPI = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const preInscriptionAPI = {
  create: async (data: PreInscriptionRequest): Promise<PreInscriptionResponse> => {
    const response = await api.post('/pre-inscriptions', data);
    return response.data;
  },
  
  getAll: async (): Promise<PreInscriptionResponse[]> => {
    const response = await api.get('/pre-inscriptions');
    return response.data;
  },
  
  getById: async (id: number): Promise<PreInscriptionResponse> => {
    const response = await api.get(`/pre-inscriptions/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<PreInscriptionResponse> => {
    const response = await api.put(`/pre-inscriptions/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/pre-inscriptions/${id}`);
  },
  
  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await api.get('/pre-inscriptions/statistics');
    return response.data;
  },
};

export const contactAPI = {
  create: async (data: ContactMessageRequest): Promise<ContactMessageResponse> => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  
  getAll: async (): Promise<ContactMessageResponse[]> => {
    const response = await api.get('/contact');
    return response.data;
  },
  
  getNew: async (): Promise<ContactMessageResponse[]> => {
    const response = await api.get('/contact/new');
    return response.data;
  },
  
  markAsRead: async (id: number): Promise<ContactMessageResponse> => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },
  
  markAsReplied: async (id: number): Promise<ContactMessageResponse> => {
    const response = await api.put(`/contact/${id}/replied`);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/contact/${id}`);
  },
};

export default api;
