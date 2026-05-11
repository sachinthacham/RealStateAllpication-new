import { Property } from "@/components/features/properties/types/property";
import {
  Wifi,
  Tv,
  Wind,
  Dumbbell,
  Car,
  TreePine,
  Waves,
  Layers,
} from "lucide-react";

interface PropertyAmenitiesProps {
  property: Property;
}

export default function PropertyAmenities({
  property,
}: PropertyAmenitiesProps) {
  const availableAmenities = [
    {
      icon: Wifi,
      label: "WiFi",
      keys: ["wifi", "internet"],
      category: "Connectivity",
    },
    { icon: Tv, label: "TV", keys: ["tv", "cable"], category: "Entertainment" },
    {
      icon: Wind,
      label: "AC",
      keys: ["ac", "air conditioning"],
      category: "Comfort",
    },
    { icon: Dumbbell, label: "Gym", keys: ["gym"], category: "Wellness" },
    { icon: Car, label: "Parking", keys: ["parking"], category: "Parking" },
    {
      icon: Waves,
      label: "Pool",
      keys: ["pool", "swimming pool"],
      category: "Leisure",
    },
    { icon: TreePine, label: "Garden", keys: ["garden"], category: "Outdoor" },
    { icon: Layers, label: "Elevator", keys: ["elevator"], category: "Access" },
  ];

  // Helper to check if property has amenity
  const hasAmenity = (keys: string[]) => {
    if (!property.amenities) return false;
    return property.amenities.some((item) => keys.includes(item.toLowerCase()));
  };

  const displayedAmenities =
    property.amenities && property.amenities.length > 0
      ? availableAmenities.filter((a) => hasAmenity(a.keys))
      : availableAmenities; // Fallback to show all if data empty

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedAmenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
          >
            <amenity.icon className="h-5 w-5 text-primary" />
            <span className="text-gray-700">{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
