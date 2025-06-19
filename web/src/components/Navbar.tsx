import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
      <Toolbar className="flex justify-between items-center max-w-7xl mx-auto w-full px-4">
        <Box className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-white no-underline" style={{ textDecoration: 'none' }}>
            <img src="/medilink-logo.svg" alt="MediLink Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
            <Typography variant="h6" component="div" className="mr-4" style={{ color: 'white', fontWeight: 700 }}>
              MediLink
            </Typography>
          </Link>
          <nav className="flex space-x-4">
            {!user ? (
              <>
                <Link href="/login" passHref legacyBehavior><Button color="inherit" className="text-white">Login</Button></Link>
                <Link href="/signup" passHref legacyBehavior><Button color="inherit" className="text-white">Sign Up</Button></Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" passHref legacyBehavior><Button color="inherit" className="text-white">Dashboard</Button></Link>
                <Link href="/appointments" passHref legacyBehavior><Button color="inherit" className="text-white">Appointments</Button></Link>
                <Link href="/reports" passHref legacyBehavior><Button color="inherit" className="text-white">Medical Reports</Button></Link>
                <Link href="/profile" passHref legacyBehavior><Button color="inherit" className="text-white">Profile</Button></Link>
              </>
            )}
          </nav>
        </Box>
        {user && (
          <Box className="flex items-center">
            <Typography variant="body1" className="text-white mr-4">
              Welcome, {user.name} ({user.role})
            </Typography>
            <Button color="inherit" onClick={handleLogout} className="text-white border border-white hover:bg-white hover:text-gray-800">
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 