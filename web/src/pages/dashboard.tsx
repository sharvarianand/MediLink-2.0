import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  if (!user) {
    return <div style={{ padding: 32 }}>Loading or redirecting...</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <p>Your role: {user.role}</p>

      {user.role === 'patient' && (
        <div>
          <h3>Patient Dashboard</h3>
          <p>Here you can view your appointments and medical reports.</p>
          {/* TODO: Add patient-specific content */}
        </div>
      )}

      {user.role === 'doctor' && (
        <div>
          <h3>Doctor Dashboard</h3>
          <p>Here you can manage appointments and view patient reports.</p>
          {/* TODO: Add doctor-specific content */}
        </div>
      )}
    </div>
  );
} 