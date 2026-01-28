import { ModeToggle } from '@/components/ModeToggle';
import Navbar from '@/components/Navbar';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDarkMode={false} toggleDarkMode={() => {}} />
      <ModeToggle />
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;