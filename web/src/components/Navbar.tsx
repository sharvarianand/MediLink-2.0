import React from 'react';
import Link from 'next/link';

const Navbar = () => (
  <nav style={{ padding: 16, borderBottom: '1px solid #eee' }}>
    <Link href="/">Home</Link> | <Link href="/login">Login</Link>
  </nav>
);

export default Navbar; 