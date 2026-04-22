"use client";

import { useEffect, useState } from "react";
import { realEstateApi } from "@/lib/api/realEstate";
import { AlertTriangle, Building2, MessageSquareWarning, Users } from "lucide-react";

interface DashboardSummary {
  totals?: {
    users?: number;
    agents?: number;
    properties?: number;
    inquiries?: number;
    visits?: number;
    openReports?: number;
  };
  last30Days?: {
    newProperties?: number;
    newInquiries?: number;
  };
}

export default function AdminListingsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moderationFilter, setModerationFilter] = useState<"" | "pending" | "approved" | "rejected">("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const [summaryResponse, propertiesResponse] = await Promise.all([
          realEstateApi.getAdminDashboardSummary(),
          realEstateApi.getAdminProperties({ moderationStatus: moderationFilter || undefined, page: 1, limit: 20 }),
        ]);
        setSummary(summaryResponse as DashboardSummary);
        setProperties(propertiesResponse.data);
      } catch (err: any) {
        setError(err?.message || "Failed to load admin summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [moderationFilter]);

  const moderateProperty = async (propertyId: string, moderationStatus: "pending" | "approved" | "rejected") => {
    try {
      const moderationNotes = window.prompt("Moderation notes (optional)") || "";
      const updated = await realEstateApi.moderateProperty(propertyId, moderationStatus, moderationNotes);
      setProperties((prev) =>
        prev.map((item) => (item._id === propertyId ? { ...item, ...updated } : item))
      );
    } catch (err: any) {
      setError(err?.message || "Failed to moderate property");
    }
  };

  return (
    <div className="surface-card subtle-ring p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Listings & KPI Overview</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading dashboard summary...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700">Total Users</p>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-blue-900">{summary?.totals?.users ?? 0}</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-indigo-700">Total Agents</p>
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-indigo-900">{summary?.totals?.agents ?? 0}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-emerald-700">Properties</p>
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">
                {summary?.totals?.properties ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-rose-700">Open Reports</p>
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-rose-900">{summary?.totals?.openReports ?? 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-slate-500">Inquiries</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{summary?.totals?.inquiries ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-slate-500">Visits</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{summary?.totals?.visits ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-slate-500">New Properties (30 days)</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {summary?.last30Days?.newProperties ?? 0}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-slate-500">New Inquiries (30 days)</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {summary?.last30Days?.newInquiries ?? 0}
            </p>
          </div>

          <div className="pt-6 border-t">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-amber-600" />
                Listing Moderation
              </h2>
              <select
                value={moderationFilter}
                onChange={(e) => setModerationFilter(e.target.value as any)}
                className="h-9 rounded border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property._id} className="rounded-xl border bg-white p-4 flex flex-wrap items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                  <div>
                    <p className="font-semibold text-slate-900">{property.title}</p>
                    <p className="text-sm text-slate-600">
                      {property.address?.city}, {property.address?.state} • {property.type}
                    </p>
                    <p className="text-xs mt-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 font-medium uppercase tracking-wide ${
                          property.moderationStatus === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : property.moderationStatus === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {property.moderationStatus || "approved"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100"
                      onClick={() => moderateProperty(property._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-100"
                      onClick={() => moderateProperty(property._id, "pending")}
                    >
                      Set Pending
                    </button>
                    <button
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100"
                      onClick={() => moderateProperty(property._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {!properties.length && (
                <div className="rounded-md border border-dashed p-6 text-sm text-gray-500">
                  No listings found for selected moderation filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
