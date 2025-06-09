import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
});

export async function login(email: string, password: string) {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
}

export async function signup(name: string, email: string, password: string, role: string, profile: any = {}) {
  const res = await API.post('/auth/signup', { name, email, password, role, profile });
  return res.data;
} 