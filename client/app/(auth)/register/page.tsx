"use client";

import { AuthForm } from "@/components/features/auth/components/AuthForm";
import { AuthLayout } from "@/components/features/auth/components/AuthLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthUser } from "@/components/features/auth/types/user";

const getDefaultRedirect = (user: AuthUser | null) => {
  if (!user) return "/login";
  if (user.role === "admin") return "/admin/listings";
  if (user.role === "agent") return "/agent/leads";
  return "/user/main";
};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const explicitRedirect = searchParams.get("redirect");

  const handleRegister = async (data: any) => {
    try {
      setError(null);
      const user = await register(data);
      const redirect = explicitRedirect || getDefaultRedirect(user);
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
      footerLinkHref={`/login${explicitRedirect ? `?redirect=${encodeURIComponent(explicitRedirect)}` : ""}`}
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
