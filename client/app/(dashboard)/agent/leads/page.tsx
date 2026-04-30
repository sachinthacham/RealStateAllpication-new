"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Inquiry,
  InquiryStatus,
  realEstateApi,
  Visit,
  VisitStatus,
} from "@/lib/api/realEstate";

const inquiryStatuses: InquiryStatus[] = ["new", "contacted", "closed"];
const visitStatuses: VisitStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "rescheduled",
  "completed",
  "cancelled",
];

export default function AgentLeadsPage() {
  const [activeTab, setActiveTab] = useState<"inquiries" | "visits">("inquiries");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [scheduleMap, setScheduleMap] = useState<Record<string, { start?: string; end?: string }>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [inquiryData, visitData] = await Promise.all([
        realEstateApi.getAssignedInquiries(),
        realEstateApi.getAssignedVisits(),
      ]);
      setInquiries(inquiryData);
      setVisits(visitData);
    } catch (err: any) {
      setError(err?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingCounts = useMemo(
    () => ({
      inquiries: inquiries.filter((i) => i.status === "new").length,
      visits: visits.filter((v) => v.status === "pending").length,
    }),
    [inquiries, visits]
  );

  const updateInquiry = async (id: string) => {
    const status = statusMap[id] as InquiryStatus | undefined;
    if (!status) return;
    try {
      await realEstateApi.updateInquiryStatus(id, status, noteMap[id]);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to update inquiry");
    }
  };

  const updateVisit = async (id: string) => {
    const status = statusMap[id] as VisitStatus | undefined;
    if (!status) return;
    try {
      await realEstateApi.updateVisitStatus(id, {
        status,
        agentNote: noteMap[id],
        decisionReason: noteMap[id],
        scheduledStartAt: scheduleMap[id]?.start,
        scheduledEndAt: scheduleMap[id]?.end,
      });
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to update visit");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leads & Visits</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage incoming buyer inquiries and viewing requests.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <Button
          variant={activeTab === "inquiries" ? "default" : "outline"}
          onClick={() => setActiveTab("inquiries")}
        >
          Inquiries ({pendingCounts.inquiries})
        </Button>
        <Button
          variant={activeTab === "visits" ? "default" : "outline"}
          onClick={() => setActiveTab("visits")}
        >
          Visits ({pendingCounts.visits})
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading leads...</div>
      ) : activeTab === "inquiries" ? (
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-gray-500">
              No inquiries yet.
            </div>
          ) : (
            inquiries.map((item) => (
              <div key={item._id} className="rounded-md border p-4">
                <h3 className="font-semibold text-gray-900">{item.property?.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                <div className="mt-2 text-sm text-gray-500">
                  From: {item.requester?.name || "Unknown"} ({item.contactEmail || item.requester?.email})
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs rounded px-2 py-1 bg-gray-100 uppercase">
                    {item.status}
                  </span>
                  <select
                    className="h-9 rounded border px-2 text-sm"
                    value={statusMap[item._id] || item.status}
                    onChange={(e) =>
                      setStatusMap((prev) => ({ ...prev, [item._id]: e.target.value }))
                    }
                  >
                    {inquiryStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button size="sm" onClick={() => updateInquiry(item._id)}>
                    Update
                  </Button>
                </div>
                <textarea
                  value={noteMap[item._id] || item.statusNote || ""}
                  onChange={(e) => setNoteMap((prev) => ({ ...prev, [item._id]: e.target.value }))}
                  className="mt-2 w-full rounded border p-2 text-sm"
                  placeholder="Status note..."
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visits.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-gray-500">
              No visit requests yet.
            </div>
          ) : (
            visits.map((item) => (
              <div key={item._id} className="rounded-md border p-4">
                <h3 className="font-semibold text-gray-900">{item.property?.title}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  Requested by {item.requester?.name || "Unknown"} on{" "}
                  {new Date(item.requestedStartAt).toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-gray-500">Status: {item.status}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    className="h-9 rounded border px-2 text-sm"
                    value={statusMap[item._id] || item.status}
                    onChange={(e) =>
                      setStatusMap((prev) => ({ ...prev, [item._id]: e.target.value }))
                    }
                  >
                    {visitStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button size="sm" onClick={() => updateVisit(item._id)}>
                    Update
                  </Button>
                </div>
                {(statusMap[item._id] || item.status) === "rescheduled" && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="datetime-local"
                      className="rounded border p-2 text-sm"
                      value={scheduleMap[item._id]?.start || ""}
                      onChange={(e) =>
                        setScheduleMap((prev) => ({
                          ...prev,
                          [item._id]: { ...(prev[item._id] || {}), start: e.target.value ? new Date(e.target.value).toISOString() : undefined },
                        }))
                      }
                    />
                    <input
                      type="datetime-local"
                      className="rounded border p-2 text-sm"
                      value={scheduleMap[item._id]?.end || ""}
                      onChange={(e) =>
                        setScheduleMap((prev) => ({
                          ...prev,
                          [item._id]: { ...(prev[item._id] || {}), end: e.target.value ? new Date(e.target.value).toISOString() : undefined },
                        }))
                      }
                    />
                  </div>
                )}
                <textarea
                  value={noteMap[item._id] || item.agentNote || ""}
                  onChange={(e) => setNoteMap((prev) => ({ ...prev, [item._id]: e.target.value }))}
                  className="mt-2 w-full rounded border p-2 text-sm"
                  placeholder="Decision note..."
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
