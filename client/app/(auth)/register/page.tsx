"use client";

import { AuthForm } from "@/components/features/auth/components/AuthForm";
import { AuthLayout } from "@/components/features/auth/components/AuthLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleRegister = async (data: any) => {
    try {
      setError(null);
      await register(data);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      description="Fill in your details to create an account"
      showSocialAuth={false}
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref={`/login?redirect=${redirect}`}
      error={error}
    >
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
