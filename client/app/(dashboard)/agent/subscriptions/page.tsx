"use client";

import { useState } from "react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";

type Plan = "BUSINESS" | "PREMIUM";

const plans: Array<{
  id: Plan;
  title: string;
  price: string;
  description: string;
}> = [
  {
    id: "BUSINESS",
    title: "Business",
    price: "LKR 5,000",
    description: "Upgrade to get higher listing limits and agent features.",
  },
  {
    id: "PREMIUM",
    title: "Premium",
    price: "LKR 12,000",
    description: "Maximum listing visibility and premium support.",
  },
];

export default function AgentSubscriptionsPage() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (plan: Plan) => {
    try {
      setError(null);
      setLoadingPlan(plan);
      const response = await apiClient.post("/payment/create-checkout-session", { plan });
      const url = response?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Agent Subscriptions</h1>
      <p className="text-sm text-gray-500 mb-6">
        Choose a plan to unlock advanced listing capabilities.
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-md border p-4">
            <h2 className="text-lg font-semibold text-gray-900">{plan.title}</h2>
            <p className="text-2xl font-bold mt-2">{plan.price}</p>
            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            <Button
              className="mt-4 w-full"
              disabled={loadingPlan === plan.id}
              onClick={() => handleCheckout(plan.id)}
            >
              {loadingPlan === plan.id ? "Redirecting..." : `Upgrade to ${plan.title}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
