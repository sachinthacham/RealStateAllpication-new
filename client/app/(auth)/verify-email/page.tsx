"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      await apiClient.post("/auth/verify-email", { token: token.trim() });
      setMessage("Email verified successfully. You can now login.");
    } catch (err: any) {
      setError(err?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-16 px-4">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify Email</h1>
        <p className="text-sm text-gray-600 mb-6">
          Paste your verification token to activate your account.
        </p>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Verification token"
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}
