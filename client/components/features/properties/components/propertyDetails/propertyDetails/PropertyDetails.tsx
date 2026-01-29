import { Property } from "@/components/features/properties/types/property";
import { Bed, Bath, Square, Car, Layers, Sun } from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const details = [
    { icon: Bed, label: "Bedrooms", value: `${property.bedrooms || 0}` },
    { icon: Bath, label: "Bathrooms", value: `${property.bathrooms || 0}` },
    {
      icon: Square,
      label: "Area",
      value: `${property.area?.toLocaleString() || 0} sq ft`,
    },
    { icon: Car, label: "Garage", value: "2 Cars" },
    { icon: Layers, label: "Floors", value: "2" },
    { icon: Sun, label: "Direction", value: "North-East" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Property Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b"
          >
            <div className="flex items-center gap-3">
              <detail.icon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{detail.label}</span>
            </div>
            <span className="font-semibold text-gray-900">{detail.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Property ID</span>
            {/* ✅ FIX: Use _id */}
            <span className="font-semibold uppercase">
              PROP-{property._id.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Status</span>
            <span className="font-semibold text-green-600 capitalize">
              {property.status?.replace("_", " ") || "Available"}
            </span>
          </div>
          {/* ... other hardcoded fields ... */}
        </div>
      </div>
    </div>
  );
}
