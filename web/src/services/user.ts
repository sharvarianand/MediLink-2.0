import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getUserProfile() {
  const res = await API.get('/users/profile');
  return res.data;
}

export async function updateUserProfile(profileData: { name?: string; profile?: any }) {
  const res = await API.put('/users/profile', profileData);
  return res.data;
} 