"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { realEstateApi, ReportItem, ReportStatus } from "@/lib/api/realEstate";
import { AlertOctagon, ShieldAlert } from "lucide-react";

const statuses: ReportStatus[] = ["open", "in_review", "resolved", "rejected"];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [riskFlags, setRiskFlags] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<"" | ReportStatus>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, ReportStatus>>({});

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reportsData, flagsData] = await Promise.all([
        realEstateApi.getReports(filterStatus || undefined),
        realEstateApi.getRiskFlags().catch(() => []),
      ]);
      setReports(reportsData);
      setRiskFlags(flagsData);
    } catch (err: any) {
      setError(err?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filterStatus]);

  const handleUpdate = async (reportId: string) => {
    const nextStatus = statusMap[reportId];
    if (!nextStatus) return;

    try {
      const note =
        nextStatus === "resolved" || nextStatus === "rejected"
          ? window.prompt("Add resolution note (optional):") || undefined
          : undefined;
      await realEstateApi.updateReportStatus(reportId, nextStatus, note);
      await loadReports();
    } catch (err: any) {
      setError(err?.message || "Failed to update report");
    }
  };

  return (
    <div className="surface-card subtle-ring p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Reports Moderation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and action user-submitted moderation reports.
          </p>
        </div>
        <select
          className="h-9 rounded border border-slate-300 bg-white px-3 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "" | ReportStatus)}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6 rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Risk Flags
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await realEstateApi.runRiskScan();
                await loadReports();
              } catch (err: any) {
                setError(err?.message || "Failed to run risk scan");
              }
            }}
          >
            Run Risk Scan
          </Button>
        </div>
        <div className="space-y-2">
          {riskFlags.slice(0, 6).map((flag) => (
            <div key={flag._id} className="rounded border p-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium uppercase text-slate-700">{flag.targetType}</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Risk score {flag.score}
                </span>
              </div>
            </div>
          ))}
          {!riskFlags.length && (
            <p className="text-sm text-gray-500">No risk flags yet.</p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-slate-500">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-slate-500">
          No reports found.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-rose-600" />
                    {report.targetType} report: {report.reason}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target ID: {report.targetId}</div>
                </div>
                <span
                  className={`text-xs rounded-full px-2 py-1 uppercase font-medium ${
                    report.status === "open"
                      ? "bg-rose-100 text-rose-700"
                      : report.status === "in_review"
                      ? "bg-amber-100 text-amber-700"
                      : report.status === "resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {report.status}
                </span>
              </div>
              {report.description && (
                <p className="text-sm text-slate-600 mt-3">{report.description}</p>
              )}
              <div className="mt-3 text-xs text-slate-500">
                Reported by: {report.reporter?.name || "Unknown"} ({report.reporter?.email || "N/A"})
              </div>
              <div className="mt-3 flex items-center gap-2">
                <select
                  className="h-9 rounded border border-slate-300 bg-white px-2 text-sm"
                  value={statusMap[report._id] || report.status}
                  onChange={(e) =>
                    setStatusMap((prev) => ({
                      ...prev,
                      [report._id]: e.target.value as ReportStatus,
                    }))
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={() => handleUpdate(report._id)}>
                  Update
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
