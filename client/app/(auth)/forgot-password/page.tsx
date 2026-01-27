'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth.store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Home, Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      clearError();
      await forgotPassword(values.email);
      console.log('Password reset email sent to:', values.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is already set in store
    }
  };

  return (
    // 1. Grid Layout adjusted: Left column is wider (1.5fr) than right column (1fr)
    <div className="w-full min-h-screen lg:grid lg:grid-cols-[1.5fr_1fr]">

      {/* LEFT COLUMN: Real Estate Image & Overlay */}
      <div
        className="hidden lg:flex relative items-center justify-start p-16 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop')"  }}
      >
        {/* Dark Blurred Overlay Card */}
        <div className="bg-black/40 backdrop-blur-md p-12 rounded-xl max-w-xl text-white shadow-2xl">
            <h2 className="text-5xl font-bold mb-6">RealEstate</h2>
            <p className="text-2xl font-medium leading-snug">
              Unlock Your Account. Regain access to manage your properties and listings.
            </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Form Side */}
      {/* Use flex-col and justify-between to space out Logo (top), Form (middle), Link (bottom) */}
      <div className="flex flex-col justify-between p-8 sm:p-12 bg-white h-full overflow-y-auto">

        {/* TOP RIGHT: Logo Area */}
        <div className="flex items-center text-xl font-bold text-gray-900 mb-8 lg:mb-0">
             <Home className="mr-2 h-6 w-6 text-blue-600" />
             RealEstate
        </div>

        {/* MIDDLE: Main Form Container (centered vertically) */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-8">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isSubmitted ? 'Check email' : 'Forgot Password'}
            </h1>
            <p className="text-base text-gray-500">
              {isSubmitted
                ? 'We have sent a password recover instructions to your email.'
                : 'Enter your email to reset your password.'}
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSubmitted ? (
              <Alert className="bg-green-50 border-green-200 mt-6">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  If an account exists with this email, you will receive a password reset link shortly.
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        {/* Label is visible in this design */}
                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              // Adjusted styling for standard rounded corners and height
                              className="pl-10 h-12 text-base bg-white border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Button: Standard rounded corners (removed rounded-full), specifically blue */}
                  <div className="pt-2">
                    <Button
                        type="submit"
                        // Use bg-blue-600 (or your primary color variable) and standard rounding
                        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                        <div className="flex items-center justify-center">
                            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending...
                        </div>
                        ) : (
                        'Send Reset Link'
                        )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>

        {/* BOTTOM: Back to Sign In Link */}
        <div className="text-center text-sm mt-8 lg:mt-0">
             <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Back to Sign In
             </Link>
        </div>

      </div>
    </div>
  );
}