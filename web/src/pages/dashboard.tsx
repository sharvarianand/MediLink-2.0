import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, Container, Paper, Button } from '@mui/material';
import Link from 'next/link';

export default function Dashboard() {
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
    <Container maxWidth="md" className="mt-10 p-6 shadow-md rounded-lg bg-white">
      <Box className="flex flex-col items-center mb-6">
        <Typography variant="h4" component="h2" className="text-gray-800 font-bold mb-2">
          Welcome, {user.name}!
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600">
          Your role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Typography>
      </Box>

      {user.role === 'patient' && (
        <Paper elevation={3} className="p-6 mb-6">
          <Typography variant="h5" component="h3" className="mb-4 text-blue-700">
            Patient Dashboard
          </Typography>
          <Typography variant="body1" className="mb-4">
            Here you can manage your medical journey:
          </Typography>
          <Box className="flex flex-col space-y-3">
            <Link href="/appointments" passHref legacyBehavior>
              <a className="text-blue-600 hover:underline">
                <Button variant="outlined" color="primary" fullWidth>Book Appointments & View History</Button>
              </a>
            </Link>
            <Link href="/reports" passHref legacyBehavior>
              <a className="text-blue-600 hover:underline">
                <Button variant="outlined" color="primary" fullWidth>Upload & View Medical Reports</Button>
              </a>
            </Link>
            <Link href="/profile" passHref legacyBehavior>
              <a className="text-blue-600 hover:underline">
                <Button variant="outlined" color="primary" fullWidth>Manage Your Profile</Button>
              </a>
            </Link>
          </Box>
        </Paper>
      )}

      {user.role === 'doctor' && (
        <Paper elevation={3} className="p-6 mb-6">
          <Typography variant="h5" component="h3" className="mb-4 text-green-700">
            Doctor Dashboard
          </Typography>
          <Typography variant="body1" className="mb-4">
            Here you can manage your appointments and patient records:
          </Typography>
          <Box className="flex flex-col space-y-3">
            <Link href="/appointments" passHref legacyBehavior>
              <a className="text-blue-600 hover:underline">
                <Button variant="outlined" color="primary" fullWidth>View & Manage Appointments</Button>
              </a>
            </Link>
            <Link href="/reports" passHref legacyBehavior>
              <a className="text-blue-600 hover:underline">
                <Button variant="outlined" color="primary" fullWidth>View Patient Reports</Button>
              </a>
            </Link>
            <Link href="/profile" passHref legacyBehavior>
              <a className="text-blue-600 hover:underline">
                <Button variant="outlined" color="primary" fullWidth>Manage Your Profile</Button>
              </a>
            </Link>
          </Box>
        </Paper>
      )}
    </Container>
  );
} 