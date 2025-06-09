import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import { Container, Typography, Box } from '@mui/material';

const AppointmentsPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  if (!user) {
    return (
      <Container maxWidth="sm" className="mt-10 p-6 shadow-md rounded-lg bg-white text-center">
        <Typography variant="h6">Loading or redirecting...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-10 p-6 shadow-md rounded-lg bg-white">
      <Box className="flex flex-col items-center mb-6">
        <Typography variant="h4" component="h2" className="text-gray-800 font-bold mb-4">
          Manage Appointments
        </Typography>
      </Box>

      {user.role === 'patient' && (
        <AppointmentForm />
      )}

      <AppointmentList />
    </Container>
  );
};

export default AppointmentsPage; 