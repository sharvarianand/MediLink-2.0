import React from 'react';
import { Typography, Box, Container, Paper, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md" className="mt-10 p-6 text-center">
      <Paper elevation={3} className="p-8 rounded-lg shadow-lg bg-white">
        <Typography variant="h3" component="h1" className="mb-4 text-gray-800 font-extrabold">
          Welcome to MediLink!
        </Typography>
        <Typography variant="h6" component="p" className="mb-6 text-gray-600">
          Your integrated medical appointment and health record system.
        </Typography>
        <Typography variant="body1" className="mb-8 text-gray-700">
          MediLink simplifies the process of booking doctor appointments and managing your medical reports with ease and security.
        </Typography>
        <Box className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/signup" passHref legacyBehavior>
            <Button variant="contained" color="primary" size="large" className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md">
              Get Started - Sign Up
            </Button>
          </Link>
          <Link href="/login" passHref legacyBehavior>
            <Button variant="outlined" color="primary" size="large" className="py-3 px-6 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold rounded-lg shadow-md">
              Already Have an Account? Login
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
} 