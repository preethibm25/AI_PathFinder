import axios from 'axios';
import {
  AuthResponse,
  User,
  StudentProfileData,
  MasterOptions,
  Question,
  AssessmentResult,
  Recommendation,
  CareerDetail,
  CareerComparison,
  Course,
  SkillGapItem,
  FamilyReport
} from '../types';

const getApiBaseUrl = () => {
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:8000/api`;
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: any) => api.post<AuthResponse>('/auth/register', data),
  login: (data: any) => api.post<AuthResponse>('/auth/login', data),
  getMe: () => api.get<User>('/auth/me'),
};

export const profileApi = {
  getProfile: () => api.get<StudentProfileData>('/profile'),
  updateProfile: (data: any) => api.put<StudentProfileData>('/profile', data),
  getOptions: () => api.get<MasterOptions>('/profile/options'),
};

export const assessmentApi = {
  getQuestions: () => api.get<Question[]>('/assessment/questions'),
  submitAssessment: (answers: Record<number, string>) =>
    api.post<AssessmentResult>('/assessment/submit', { answers }),
  getResult: () => api.get<AssessmentResult>('/assessment/result'),
};

export const recommendationApi = {
  generate: () => api.post<Recommendation[]>('/recommendations/generate'),
  getAll: () => api.get<Recommendation[]>('/recommendations'),
  getById: (id: number) => api.get<Recommendation>(`/recommendations/${id}`),
};

export const careerApi = {
  getAll: (params?: { search?: string; category?: string }) =>
    api.get<any[]>('/careers', { params }),
  getById: (id: number) => api.get<CareerDetail>(`/careers/${id}`),
  compare: (careerIds: number[]) =>
    api.post<CareerComparison[]>('/careers/compare', { career_ids: careerIds }),
};

export const skillApi = {
  getAll: () => api.get<any[]>('/skills'),
  getGaps: () => api.get<SkillGapItem[]>('/skills/gap'),
};

export const courseApi = {
  getAll: (params?: { career_id?: number; level?: string; mode?: string; search?: string }) =>
    api.get<Course[]>('/courses', { params }),
  getById: (id: number) => api.get<Course>(`/courses/${id}`),
};

export const familyApi = {
  getInvite: () => api.post<{ student_code: string; message: string }>('/family/invite'),
  linkStudent: (student_code: string) =>
    api.post<{ success: boolean; message: string; student_name: string; student_id: number }>(
      '/family/link',
      { student_code }
    ),
  getReport: (studentId?: number) =>
    api.get<FamilyReport>('/family/report', { params: { student_id: studentId } }),
  submitPreference: (data: { career_id: number; notes?: string; is_final_family_choice?: boolean }, studentId?: number) =>
    api.post<{ success: boolean; message: string; consensus_status: string }>('/family/preference', data, {
      params: { student_id: studentId }
    }),
};

export const adminApi = {
  getStats: () => api.get<any>('/admin/stats'),
  getStudents: () => api.get<any[]>('/admin/students'),
  createCareer: (data: any) => api.post<any>('/admin/careers', data),
  updateCareer: (id: number, data: any) => api.put<any>(`/admin/careers/${id}`, data),
  deleteCareer: (id: number) => api.delete<any>(`/admin/careers/${id}`),
  createCourse: (data: any) => api.post<any>('/admin/courses', data),
  deleteCourse: (id: number) => api.delete<any>(`/admin/courses/${id}`),
  createQuestion: (data: any) => api.post<any>('/admin/questions', data),
  deleteQuestion: (id: number) => api.delete<any>(`/admin/questions/${id}`),
};

export default api;
