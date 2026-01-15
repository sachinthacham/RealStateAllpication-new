import { Property } from "@/components/features/properties/types/property";
import { Calendar, Building, Home, Layers } from "lucide-react";

interface PropertyOverviewProps {
  property: Property;
}

export default function PropertyOverview({ property }: PropertyOverviewProps) {
  const formatType = (type: string) =>
    type ? type.charAt(0).toUpperCase() + type.slice(1) : "Property";

  console.log("Rendering PropertyOverview with property:", property.type);
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Property Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Property Type</p>
            {/* ✅ FIX: property.type */}
            <p className="font-semibold text-gray-900">
              {formatType(property.type)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Year Built</p>
            <p className="font-semibold text-gray-900">
              {property.yearBuilt || 2023}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Stories</p>
            <p className="font-semibold text-gray-900">2 Floors</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Available From</p>
            <p className="font-semibold text-gray-900">Immediately</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Description
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {property.description ||
            `This stunning ${property.type} offers modern living...`}
        </p>
      </div>
    </div>
  );
}
