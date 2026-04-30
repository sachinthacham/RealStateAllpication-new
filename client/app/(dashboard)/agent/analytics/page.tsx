"use client";

import { useEffect, useState } from "react";
import { realEstateApi } from "@/lib/api/realEstate";

export default function AgentAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    inquiriesTotal: 0,
    inquiriesClosed: 0,
    visitsTotal: 0,
    visitsAccepted: 0,
    visitsCompleted: 0,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const [inquiries, visits] = await Promise.all([
          realEstateApi.getAssignedInquiries(),
          realEstateApi.getAssignedVisits(),
        ]);
        setMetrics({
          inquiriesTotal: inquiries.length,
          inquiriesClosed: inquiries.filter((i) => i.status === "closed").length,
          visitsTotal: visits.length,
          visitsAccepted: visits.filter((v) => v.status === "accepted").length,
          visitsCompleted: visits.filter((v) => v.status === "completed").length,
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Agent Analytics</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border p-4">
            <p className="text-sm text-gray-500">Total Inquiries</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.inquiriesTotal}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-sm text-gray-500">Closed Inquiries</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.inquiriesClosed}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-sm text-gray-500">Visits Requested</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.visitsTotal}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-sm text-gray-500">Accepted Visits</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.visitsAccepted}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-sm text-gray-500">Completed Visits</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.visitsCompleted}</p>
          </div>
        </div>
      )}
    </div>
  );
}
