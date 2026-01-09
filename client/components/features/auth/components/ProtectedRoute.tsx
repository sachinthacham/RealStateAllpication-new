'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'agent' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  
  // 1. Local state to block rendering until verification is totally done
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Optimization: If Zustand already says we are logged in, 
      // we trust it and stop verifying immediately.
      if (isAuthenticated) {
        setIsVerifying(false);
        return;
      }

      // Otherwise, run the full check (reads localStorage)
      await checkAuth();
      setIsVerifying(false);
    };

    initAuth();
  }, [checkAuth, isAuthenticated]);

  useEffect(() => {
    // 2. Only run redirection logic AFTER verification is finished
    if (!isVerifying) {
      if (!isAuthenticated) {
        console.log("Access Denied. Redirecting to login from:", pathname);
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isVerifying, isAuthenticated, requiredRole, user, router, pathname]);

  // 3. Show Loading Spinner while verifying (Prevents premature redirect)
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // 4. Final Guard: If we are done verifying and still not authenticated, render nothing.
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}