"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { usePropertyStore } from "@/stores/property.store";
import { propertyApi } from "@/lib/api/properties";
import { Property } from "@/components/features/properties/types/property";
import { Loader2 } from "lucide-react";
import {
  PropertyAmenities,
  PropertyHeader,
  PropertyGallery,
  PropertyOverview,
  PropertyDetails,
  PropertyLocation,
  PropertyReviews,
  PropertySidebar,
} from "@/components/features/properties/components/propertyDetails/";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const unwrappedParams = use(params);
  const propertyId = unwrappedParams.id;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToRecentViews } = usePropertyStore();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const response: any = await propertyApi.getById(propertyId);

        // Handle { success: true, data: ... } wrapper
        const data = response.data.data || response;

        if (data) {
          setProperty(data);
          addToRecentViews(data._id);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId, addToRecentViews]);

  console.log(
    "Rendering PropertyPage with property:",
    property,
    "Loading:",
    loading
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyHeader property={property} />
      <section className="py-6">
        <div className="container px-4 mx-auto">
          <PropertyGallery property={property} />
        </div>
      </section>
      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <PropertyOverview property={property} />
            <PropertyDetails property={property} />
            <PropertyAmenities property={property} />
            <PropertyLocation property={property} />
            <PropertyReviews property={property} />
          </div>
          <div className="lg:w-1/3">
            <PropertySidebar property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
