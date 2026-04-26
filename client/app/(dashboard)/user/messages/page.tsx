"use client";

import { useEffect, useState } from "react";
import { realEstateApi } from "@/lib/api/realEstate";
import { Button } from "@/components/ui/button";

export default function UserMessagesPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState("");
  const [initialMessage, setInitialMessage] = useState("");

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await realEstateApi.getChatThreads();
      setThreads(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const createThread = async () => {
    if (!participantId.trim()) return;
    try {
      await realEstateApi.createChatThread({
        participants: [participantId.trim()],
        initialMessage: initialMessage || "Hi",
      });
      setParticipantId("");
      setInitialMessage("");
      await loadThreads();
    } catch (err: any) {
      setError(err?.message || "Failed to create thread");
    }
  };

  const escalateThread = async (threadId: string) => {
    try {
      await realEstateApi.escalateChatThread(threadId);
      await loadThreads();
    } catch (err: any) {
      setError(err?.message || "Failed to escalate thread");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Messages</h1>
      <p className="text-sm text-gray-600 mb-6">
        Placeholder chat workflow with moderation escalation support.
      </p>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-md border p-4 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Start New Thread</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            className="rounded border p-2 text-sm"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            placeholder="Participant user id"
          />
          <input
            className="rounded border p-2 text-sm"
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            placeholder="Initial message"
          />
        </div>
        <Button className="mt-3" onClick={createThread}>
          Create Thread
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading threads...</p>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div key={thread._id} className="rounded-md border p-4">
              <p className="text-sm text-gray-700">
                Participants: {(thread.participants || []).map((p: any) => p.name || p._id).join(", ")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last message: {thread.lastMessage || "No messages yet"}
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => escalateThread(thread._id)}>
                  Escalate to Moderation
                </Button>
              </div>
            </div>
          ))}
          {!threads.length && (
            <div className="rounded-md border border-dashed p-6 text-sm text-gray-500">
              No threads yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
