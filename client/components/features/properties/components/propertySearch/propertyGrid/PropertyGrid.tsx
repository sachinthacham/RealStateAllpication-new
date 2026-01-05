import { Property } from "@/components/features/properties/types/property";
// FIX: This path must be exactly correct relative to this file
import PropertyCard from "../propertyCard/PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  viewMode: "grid" | "list" | "map";
}

export default function PropertyGrid({
  properties,
  favorites,
  onToggleFavorite,
  viewMode,
}: PropertyGridProps) {
  // Safety Check: Ensure properties is actually an array before mapping
  if (!Array.isArray(properties)) {
    console.error("PropertyGrid received invalid data:", properties);
    return <div>Error loading grid data</div>;
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property._id} className="w-full">
            <PropertyCard
              property={property}
              isFavorite={favorites.includes(property._id)}
              onToggleFavorite={onToggleFavorite}
              viewMode="list"
            />
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === "map") {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
        <div className="text-gray-500 mb-8 max-w-md mx-auto">
          {/* SVG content */}
          <h3 className="text-xl font-semibold text-gray-700">
            Map View Coming Soon
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          isFavorite={favorites.includes(property._id)}
          onToggleFavorite={onToggleFavorite}
          viewMode="grid"
        />
      ))}
    </div>
  );
}
