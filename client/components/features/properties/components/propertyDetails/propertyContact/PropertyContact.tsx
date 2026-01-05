"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/components/features/properties/types/property";

interface PropertyContactProps {
  property: Property;
}

export default function PropertyContact({ property }: PropertyContactProps) {
  // Use Agent data from backend if it exists (it comes as an ID or Object depending on population)
  // Assuming for now agent is an object with name/email based on your interface
  const agentName = (property.agent as any)?.name || "Agent";
  const agentEmail = (property.agent as any)?.email || "agent@property.lk";

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in ${property.title} located at ${property.address?.city}. Please contact me with more details.`,
    preferredTime: "",
    preferredDate: "",
  });

  const [activeTab, setActiveTab] = useState<
    "call" | "email" | "whatsapp" | "tour"
  >("call");

  const contactMethods = [
    {
      id: "call",
      icon: Phone,
      label: "Call Now",
      description: "Talk directly",
      value: "+94 77 123 4567",
    },
    {
      id: "email",
      icon: Mail,
      label: "Send Email",
      description: "Get details via email",
      value: agentEmail,
    },
    {
      id: "whatsapp",
      icon: MessageSquare,
      label: "WhatsApp",
      description: "Quick chat",
      value: "+94 77 123 4567",
    },
    {
      id: "tour",
      icon: Calendar,
      label: "Schedule",
      description: "Book viewing",
      value: "Schedule Now",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    alert("Inquiry Sent!");
  };

  const handleContactMethod = (methodId: string) => {
    setActiveTab(methodId as any);
    // ... logic same as before ...
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Contact About This Property
      </h2>

      {/* Contact Agent Info */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{agentName}</h3>
              <p className="text-sm text-gray-600">Property Agent</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              Response Time
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <Clock className="h-4 w-4" /> Within 1 hour
            </div>
          </div>
        </div>
      </div>

      {/* Form (Keep existing form code) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... inputs ... */}
        <Textarea
          required
          value={contactForm.message}
          onChange={(e) =>
            setContactForm({ ...contactForm, message: e.target.value })
          }
          rows={5}
          className="resize-none"
        />
        <Button type="submit" size="lg" className="w-full">
          Send Inquiry
        </Button>
      </form>
    </div>
  );
}
