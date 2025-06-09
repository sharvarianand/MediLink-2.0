import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';

const AppointmentsPage = () => {
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
      <h2>Appointments</h2>

      {user.role === 'patient' && (
        <AppointmentForm />
      )}

      <AppointmentList />
    </div>
  );
};

export default AppointmentsPage; 