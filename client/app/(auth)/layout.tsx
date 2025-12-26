import { Suspense } from 'react';
import { AuthProvider } from '@/components/providers/Auth.provider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
}