import Link from "next/link";
import { Building2, Flag, ShieldCheck, Users } from "lucide-react";

const navItems = [
  { href: "/admin/listings", label: "Listings", icon: Building2 },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="section-container py-6 space-y-5">
        <div className="surface-card subtle-ring p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
                Administration Center
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-1">
                RealEstate Pro Operations
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Moderate listings, handle reports, and manage platform users.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Admin privileges active
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
