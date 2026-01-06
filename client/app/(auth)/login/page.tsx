"use client";

import { AuthForm } from "@/components/features/auth/components/AuthForm";
import { AuthLayout } from "@/components/features/auth/components/AuthLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (data: any) => {
    try {
      setError(null);
      await login(data);
      console.log("Login successful, redirecting to:", redirect);
      router.push(redirect);
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
      footerLinkHref={`/register?redirect=${redirect}`}
      error={error}
    >
      <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
    </AuthLayout>
  );
}
