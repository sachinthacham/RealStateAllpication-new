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
import { realEstateApi } from "@/lib/api/realEstate";
import { useAuthStore } from "@/stores/auth.store";

interface PropertyContactProps {
  property: Property;
}

export default function PropertyContact({ property }: PropertyContactProps) {
  const agentName = (property.agent as any)?.name || "Agent";
  const agentEmail = (property.agent as any)?.email || "agent@property.lk";
  const agentPhone = (property as any)?.whatsappNumber || "+94770000000";
  const { user } = useAuthStore();

  const [contactForm, setContactForm] = useState({
    email: user?.email || "",
    phone: "",
    message: `Hi, I'm interested in ${property.title} located at ${property.address?.city}. Please contact me with more details.`,
    preferredDate: "",
    preferredStartTime: "",
    preferredEndTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"call" | "email" | "whatsapp" | "tour" | "report">(
    "email"
  );

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
    {
      id: "report",
      icon: MessageSquare,
      label: "Report Listing",
      description: "Flag this property",
      value: "Moderate",
    },
  ];

  const ensureAuthenticated = () => {
    if (!user?._id) {
      setErrorMessage("Please login first to contact the agent.");
      return false;
    }
    return true;
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthenticated()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setStatusMessage(null);
      await realEstateApi.createInquiry({
        propertyId: property._id,
        message: contactForm.message,
        contactEmail: contactForm.email || undefined,
        contactPhone: contactForm.phone || undefined,
      });
      setStatusMessage("Inquiry sent successfully.");
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to send inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthenticated()) return;

    if (!contactForm.preferredDate || !contactForm.preferredStartTime || !contactForm.preferredEndTime) {
      setErrorMessage("Please provide date and time range for the visit.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setStatusMessage(null);
      const start = new Date(`${contactForm.preferredDate}T${contactForm.preferredStartTime}`);
      const end = new Date(`${contactForm.preferredDate}T${contactForm.preferredEndTime}`);
      await realEstateApi.createVisit({
        propertyId: property._id,
        requestedStartAt: start.toISOString(),
        requestedEndAt: end.toISOString(),
        requesterNote: contactForm.message,
      });
      setStatusMessage("Visit request sent successfully.");
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to request visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportListing = async () => {
    if (!ensureAuthenticated()) return;

    const reason =
      (window.prompt(
        "Report reason (spam, fraud, misleading_information, offensive_content, duplicate_listing, other)"
      ) || "other") as
        | "spam"
        | "fraud"
        | "misleading_information"
        | "offensive_content"
        | "duplicate_listing"
        | "other";
    const description = window.prompt("Describe the issue (optional)") || undefined;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setStatusMessage(null);
      await realEstateApi.createReport({
        targetType: "property",
        targetId: property._id,
        reason,
        description,
      });
      setStatusMessage("Report submitted to moderation.");
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactMethod = async (methodId: string) => {
    setActiveTab(methodId as any);
    if (methodId === "call") {
      window.location.href = `tel:${agentPhone}`;
      return;
    }
    if (methodId === "whatsapp") {
      try {
        const link = await realEstateApi.generateWhatsappLink(
          agentPhone,
          `Hi ${agentName}, I'm interested in ${property.title}.`
        );
        window.open(link, "_blank");
      } catch (error: any) {
        setErrorMessage(error?.message || "Failed to open WhatsApp");
      }
      return;
    }
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

      <div className="grid grid-cols-2 gap-2 mb-5">
        {contactMethods.map((method) => (
          <Button
            key={method.id}
            type="button"
            variant={activeTab === method.id ? "default" : "outline"}
            className="justify-start"
            onClick={() => handleContactMethod(method.id)}
          >
            <method.icon className="h-4 w-4 mr-2" />
            {method.label}
          </Button>
        ))}
      </div>

      {errorMessage && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {statusMessage && (
        <div className="mb-3 rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      {activeTab === "tour" ? (
        <form onSubmit={handleSubmitVisit} className="space-y-3">
          <Input
            type="date"
            value={contactForm.preferredDate}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, preferredDate: e.target.value }))
            }
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="time"
              value={contactForm.preferredStartTime}
              onChange={(e) =>
                setContactForm((prev) => ({ ...prev, preferredStartTime: e.target.value }))
              }
              required
            />
            <Input
              type="time"
              value={contactForm.preferredEndTime}
              onChange={(e) =>
                setContactForm((prev) => ({ ...prev, preferredEndTime: e.target.value }))
              }
              required
            />
          </div>
          <Textarea
            value={contactForm.message}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={4}
            className="resize-none"
          />
          <Button disabled={isSubmitting} type="submit" size="lg" className="w-full">
            {isSubmitting ? "Submitting..." : "Request Visit"}
          </Button>
        </form>
      ) : activeTab === "report" ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Use this only for policy violations, scams, misleading content, or abuse.
          </p>
          <Button disabled={isSubmitting} onClick={handleReportListing} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmitInquiry} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email"
            value={contactForm.email}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Input
            type="tel"
            placeholder="Phone (optional)"
            value={contactForm.phone}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <Textarea
            required
            value={contactForm.message}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={5}
            className="resize-none"
          />
          <Button disabled={isSubmitting} type="submit" size="lg" className="w-full">
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              try {
                setErrorMessage(null);
                setStatusMessage(null);
                await realEstateApi.dispatchCommunication({
                  channel: "email",
                  recipient: agentEmail,
                  subject: `New enquiry for ${property.title}`,
                  message: contactForm.message,
                  context: {
                    propertyId: property._id,
                    fromEmail: contactForm.email,
                    fromPhone: contactForm.phone,
                  },
                });
                setStatusMessage("Email dispatch queued (placeholder integration).");
              } catch (error: any) {
                setErrorMessage(error?.message || "Failed to queue email dispatch");
              }
            }}
          >
            Queue Email Dispatch
          </Button>
        </form>
      )}
    </div>
  );
}
