import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/ProfileForm';

const ProfilePage = () => {
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
      <h2>User Profile</h2>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage; 