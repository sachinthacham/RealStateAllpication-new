import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
//import { SessionProvider } from 'next-auth/react';
//import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import Navbar from '@/components/layouts/header/Navbar';
import { ProtectedRoute } from '@/components/features/auth/components/ProtectedRoute';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sri Lanka Properties',
  description: 'Find your dream property in Sri Lanka',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
            <Navbar />
           
            <main>{children}</main>
          
            
          
      </body>
    </html>
  );
}