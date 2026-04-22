'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, User, Phone, LogIn, UserPlus, UserIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const accountHref =
    user?.role === 'admin'
      ? '/admin/listings'
      : user?.role === 'agent'
      ? '/agent/leads'
      : '/user/main';

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact', icon: <Phone size={18} /> },
    { name: 'Agents', href: '/agent', icon: <User size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="section-container flex h-18 items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">RealEstate Pro</span>
            <p className="text-xs text-slate-500 -mt-0.5">Sri Lanka Property Marketplace</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1"
            >
              {link.icon && <span>{link.icon}</span>}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
            <Link href="/post-ad">Post Property</Link>
          </Button>
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="flex items-center space-x-2">
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button size="sm" className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700" asChild>
                <Link href="/register" className="flex items-center space-x-2">
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href={accountHref} className="flex items-center space-x-2">
                <UserIcon size={16} />
                <span>My Account</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px]">
            <div className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-3 py-2 text-lg font-medium"
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-6 border-t space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Button className="w-full" asChild>
                      <Link href="/login" className="flex items-center justify-center space-x-2">
                        <LogIn size={16} />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/register" className="flex items-center justify-center space-x-2">
                        <UserPlus size={16} />
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={accountHref} className="flex items-center justify-center space-x-2">
                      <UserIcon size={16} />
                      <span>My Account</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}