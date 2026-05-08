import Link from "next/link";

interface AgentProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const resolvedParams = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Agent Profile</h1>
        <p className="text-sm text-gray-600 mb-4">
          Agent details UI is being finalized. Agent id: {resolvedParams.id}
        </p>
        <Link href="/agent" className="text-blue-600 hover:text-blue-700 text-sm">
          Back to agent list
        </Link>
      </div>
    </div>
  );
}
