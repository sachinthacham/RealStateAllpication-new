"use client";

import { useEffect, useState } from "react";
import { realEstateApi } from "@/lib/api/realEstate";

export default function IntegrationsJobsPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await realEstateApi.getNotificationPreferences();
        setPrefs(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Background Jobs & Integrations</h1>
      <p className="text-sm text-gray-600 mb-6">
        Placeholder dashboards for notification digests, provider delivery queue, and automation jobs.
      </p>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Email Digest Mode</p>
            <p className="font-semibold">{prefs?.emailDigest || "daily"}</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">WhatsApp Provider</p>
            <p className="font-semibold">Placeholder Connected</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Queue Health</p>
            <p className="font-semibold">Operational</p>
          </div>
        </div>
      )}
    </div>
  );
}
