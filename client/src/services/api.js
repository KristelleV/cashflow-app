import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Retailer Service
export const retailerService = {
  getAll: () => api.get('/retailers'),
  getOne: (id) => api.get(`/retailers/${id}`),
  create: (data) => api.post('/retailers', data),
  update: (id, data) => api.put(`/retailers/${id}`, data),
  delete: (id) => api.delete(`/retailers/${id}`),
  getStats: () => api.get('/retailers/stats/dashboard'),
};

// Payroll Service
export const payrollService = {
  getAll: () => api.get('/payroll'),
  create: (data) => api.post('/payroll', data),
  update: (id, data) => api.put(`/payroll/${id}`, data),
  delete: (id) => api.delete(`/payroll/${id}`),
};

// Overhead Service
export const overheadService = {
  getAll: () => api.get('/overheads'),
  create: (data) => api.post('/overheads', data),
  update: (id, data) => api.put(`/overheads/${id}`, data),
  delete: (id) => api.delete(`/overheads/${id}`),
};

export default api;
