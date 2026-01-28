import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  showSocialAuth?: boolean;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  error?: string | null;
}

export function AuthLayout({
  title,
  description,
  children,
  showSocialAuth = false,
  footerText,
  footerLinkText,
  footerLinkHref,
  error
}: AuthLayoutProps) {
  return (
    <div className="w-full min-h-20 lg:grid lg:grid-cols-2">
      
      {/* LEFT COLUMN: Background Image & Branding */}
      <div className="hidden relative h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        {/* Background Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop')" 
            }} 
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Branding Content (Z-Index ensures it sits on top of image) */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          {/* Optional Logo Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          RealEstate
        </div>

        <div className="relative z-20 mt-4">
          <blockquote className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome back.</h1>
            <p className="text-lg text-gray-200">
              Manage your properties and view your listings in one place.
            </p>
          </blockquote>
        </div>
      </div>

      {/* RIGHT COLUMN: Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="mx-auto w-full max-w-md space-y-6">
          
          <Card className="border-0 shadow-none bg-transparent sm:border sm:shadow-lg sm:bg-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold tracking-tight">
                {title}
              </CardTitle>
              <CardDescription className="text-center">
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {children}

              {showSocialAuth && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button">
                      {/* Google Icon SVG */}
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button">
                       {/* Facebook Icon SVG */}
                       <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.972h3.618l-1.428 3.667h-2.19v7.98c2.475-2.542 4.093-6.039 4.093-9.981C18.213 6.592 12.62 1 5.72 1 2.56 1 0 6.592 0 14.502c0 3.942 1.618 7.439 4.093 9.981.657-.301 1.258-.571 1.918-.792.658-.22.658-.22.658-.22z"/></svg>
                      Facebook
                    </Button>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                {footerText}{' '}
                <Link
                  href={footerLinkHref}
                  className="text-primary hover:underline font-medium"
                >
                  {footerLinkText}
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground px-8">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}