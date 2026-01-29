"use client";
import { MapPin } from "lucide-react";
import { Property } from "@/components/features/properties/types/property";

interface PropertyLocationProps {
  property: Property;
}

export default function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
      <div className="rounded-xl overflow-hidden mb-8 relative aspect-video bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-600">
            {property.location?.coordinates
              ? `${property.location.coordinates[1]}, ${property.location.coordinates[0]}`
              : "Map Unavailable"}
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
        <MapPin className="h-5 w-5 text-primary mt-1" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
          {/* ✅ FIX: proper address mapping */}
          <p className="text-gray-600">
            {property.address?.street}, {property.address?.city},{" "}
            {property.address?.country}
          </p>
        </div>
      </div>
    </div>
  );
}
