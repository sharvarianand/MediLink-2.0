import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signup } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Typography, Box, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await signup(name, email, password, role);
      authLogin(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="xs" className="mt-10 p-6 shadow-md rounded-lg bg-white">
      <Box className="flex flex-col items-center">
        <Typography variant="h5" component="h2" className="mb-6 text-gray-800 font-semibold">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && <Typography color="error" className="mb-4 text-sm">{error}</Typography>}
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
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
          <FormControl fullWidth variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={e => setRole(e.target.value as string)}
              label="Role"
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
} 