import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import { TextField, Button, Typography, Box, Container, Grid, Link } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      authLogin(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs" className="mt-10 p-6 shadow-md rounded-lg bg-white">
      <Box className="flex flex-col items-center">
        <Typography variant="h5" component="h2" className="mb-6 text-gray-800 font-semibold">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && <Typography color="error" className="mb-4 text-sm">{error}</Typography>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
            <Grid item>
              <Link href="/forgot-password" variant="body2" sx={{ ml: 2 }}>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
} 