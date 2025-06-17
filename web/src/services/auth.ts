import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
});

// Add request interceptor for debugging
API.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
}

export const signup = async (name: string, email: string, password: string, role: string, profile: any = {}) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role, profile }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Signup failed');
    }
};

export async function forgotPassword(email: string) {
  const res = await API.post('/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(token: string, password: string) {
  const res = await API.post(`/auth/reset-password/${token}`, { password });
  return res.data;
} 