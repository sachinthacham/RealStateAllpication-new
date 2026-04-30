"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // For extracting token from URL
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, CheckCircle, Home, Lock, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store"; // Update path if needed
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// --- Schema Validation ---
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// Background Image (Same as Forgot Password page)
const realEstateImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Assumes URL is /reset-password?token=...

  const { resetPassword, isLoading, error: storeError, clearError } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      form.setError("root", { message: "Invalid or missing reset token." });
      return;
    }

    try {
      clearError();
      await resetPassword(token, data.password);
      setIsSuccess(true);
      // Optional: Redirect to login after 3 seconds
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      // Error is handled by store, but we can log it or ensure UI updates
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-[1.5fr_1fr]">
      
      {/* LEFT COLUMN: Image & Overlay */}
      <div
        className="hidden lg:flex relative items-center justify-start p-16 bg-cover bg-center"
        style={{ backgroundImage: `url('${realEstateImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/30" /> {/* Dark tint specifically for image */}
        
        <div className="relative z-10 bg-black/40 backdrop-blur-md p-12 rounded-xl max-w-xl text-white shadow-2xl">
          <h2 className="text-5xl font-bold mb-6">Secure Your Account</h2>
          <p className="text-2xl font-medium leading-snug">
            Create a strong new password to protect your property portfolio and personal data.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Form Side */}
      <div className="flex flex-col justify-between p-8 sm:p-12 bg-white h-full overflow-y-auto">
        
        {/* Logo */}
        <div className="flex items-center text-xl font-bold text-gray-900 mb-8 lg:mb-0">
          <Home className="mr-2 h-6 w-6 text-blue-600" />
          RealEstate
        </div>

        {/* Main Form Content */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-8">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h1>
            <p className="text-base text-gray-500">
              Please enter your new password below.
            </p>
          </div>

          <div className="mt-8">
            {/* Global Error Alert */}
            {(storeError || form.formState.errors.root) && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {storeError || form.formState.errors.root?.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Missing Token Alert */}
            {!token && !isSuccess && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Missing reset token. Please click the link provided in your email.
                </AlertDescription>
              </Alert>
            )}

            {isSuccess ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 font-medium">
                    Password reset successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => router.push("/login")}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Go to Login Now
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* New Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12 text-base bg-white border-gray-300 rounded-md focus:border-blue-500 transition-all"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12 text-base bg-white border-gray-300 rounded-md focus:border-blue-500 transition-all"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading || !token}
                      className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Resetting...
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-sm mt-8 lg:mt-0">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}