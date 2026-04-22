"use client";

import { useEffect, useState } from "react";
import { realEstateApi } from "@/lib/api/realEstate";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, Users } from "lucide-react";

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "agent" | "admin">("");
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await realEstateApi.getAdminUsers({ role: roleFilter || undefined, page: 1, limit: 20 });
        setUsers(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err?.message || "Failed to load user stats");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [roleFilter]);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await realEstateApi.updateAdminUserStatus(userId, !isActive);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: !isActive } : u))
      );
    } catch (err: any) {
      setError(err?.message || "Failed to update user status");
    }
  };

  return (
    <div className="surface-card subtle-ring p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Users & Access Management</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">Loaded Users</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-blue-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-emerald-700">Active Accounts</p>
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-emerald-900">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-indigo-700">Admins in View</p>
            <Shield className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-indigo-900">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="h-9 rounded border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">All roles</option>
          <option value="user">Users</option>
          <option value="agent">Agents</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading user stats...</div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Showing {users.length} users (page {pagination?.page || 1} of {pagination?.totalPages || 1})
          </p>
          {users.map((user) => (
            <div key={user._id} className="rounded-xl border bg-white p-4 flex flex-wrap items-center justify-between gap-3 hover:shadow-sm transition-shadow">
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
                <p className="text-xs text-slate-500 uppercase mt-1">{user.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs rounded-full px-2 py-1 font-medium ${
                    user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Disabled"}
                </span>
                <Button size="sm" variant="outline" onClick={() => toggleUserStatus(user._id, user.isActive)}>
                  {user.isActive ? "Disable" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
          {!users.length && (
            <div className="rounded-md border border-dashed p-6 text-sm text-gray-500">
              No users found for selected filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
