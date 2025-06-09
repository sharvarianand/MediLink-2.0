import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link href="/">Home</Link> |
        {!user && (
          <>
            <Link href="/login"> Login</Link> |
            <Link href="/signup"> Sign Up</Link>
          </>
        )}
        {user && (
          <>
            <Link href="/dashboard"> Dashboard</Link> |
            <Link href="/appointments"> Appointments</Link> |
            <Link href="/reports"> Medical Reports</Link> |
            <Link href="/profile"> Profile</Link>
          </>
        )}
      </div>
      {user && (
        <div>
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 