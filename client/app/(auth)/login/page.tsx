"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/features/auth/components/AuthForm";
import { AuthLayout } from "@/components/features/auth/components/AuthLayout";
import { useAuthStore } from "@/stores/auth.store";
import { AuthUser } from "@/components/features/auth/types/user";

const getDefaultRedirect = (user: AuthUser | null) => {
  if (!user) return "/";
  if (user.role === "admin") return "/admin/listings";
  if (user.role === "agent") return "/agent/leads";
  return "/user/main";
};

// 1. Separate component to handle searchParams logic safely
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // 2. Get redirect path, default to '/' (Home) or '/dashboard'
  const redirectParam = searchParams.get("redirect");
  const explicitRedirect = redirectParam ? decodeURIComponent(redirectParam) : null;

  const handleLogin = async (data: any) => {
    try {
      setError(null);
      
      // 3. Wait for login to complete (Token saved, state updated)
      const user = await login(data);
      const redirect = explicitRedirect || getDefaultRedirect(user);

      console.log("Login successful. Redirecting to:", redirect);

      // 4. Use router.push with a tiny delay
      // This ensures the AuthStore update propagates to the ProtectedRoute 
      // BEFORE the page transition happens.
      setTimeout(() => {
        router.push(redirect);
      }, 100);

    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      description="Enter your credentials to access your account"
      showSocialAuth={true}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref={`/register${explicitRedirect ? `?redirect=${encodeURIComponent(explicitRedirect)}` : ""}`}
      error={error}
    >
      <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
    </AuthLayout>
  );
}

// 5. Wrap in Suspense (Required for useSearchParams in Client Components)
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}