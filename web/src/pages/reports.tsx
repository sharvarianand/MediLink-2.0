import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import ReportUpload from '../components/ReportUpload';
import ReportList from '../components/ReportList';
import { Container, Typography, Box } from '@mui/material';

const ReportsPage = () => {
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
          Medical Reports
        </Typography>
      </Box>

      {user.role === 'patient' && (
        <ReportUpload />
      )}

      <ReportList />
    </Container>
  );
};

export default ReportsPage; 