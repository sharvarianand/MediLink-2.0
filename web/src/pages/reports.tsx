import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import ReportUpload from '../components/ReportUpload';
import ReportList from '../components/ReportList';

const ReportsPage = () => {
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
      <h2>Medical Reports</h2>

      {user.role === 'patient' && (
        <ReportUpload />
      )}

      <ReportList />
    </div>
  );
};

export default ReportsPage; 