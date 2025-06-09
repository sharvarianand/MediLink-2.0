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

export async function createAppointment(appointmentData: {
  doctorId: string;
  dateTime: string;
  symptoms: string;
  notes?: string;
}) {
  const res = await API.post('/appointments', appointmentData);
  return res.data;
}

export async function getAppointments() {
  const res = await API.get('/appointments');
  return res.data;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string
) {
  const res = await API.put(`/appointments/${appointmentId}/status`, { status });
  return res.data;
}

export async function getDoctors() {
  const res = await API.get('/users/doctors');
  return res.data;
} 