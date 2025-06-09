import React, { ReactNode } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>{children}</main>
  </>
);

export default Layout; 