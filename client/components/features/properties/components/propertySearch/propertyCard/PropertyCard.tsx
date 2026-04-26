import Link from "next/link";
import { Property } from "@/components/features/properties/types/property";
import { MapPin, Bed, Bath, Square, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  viewMode?: "grid" | "list";
}

export default function PropertyCard({
  property,
  isFavorite = false,
  onToggleFavorite,
}: PropertyCardProps) {
  //  THE ROBUST IMAGE HELPER
  const getImageUrl = (images?: string[]) => {
    // 1. Handle No Images -> Return Placeholder
    if (!images || images.length === 0 || !images[0]) {
      return "/images.png"; // Ensure this file exists in your /public folder
    }

    const mainImage = images[0];

    // 2. Handle External URLs (e.g., https://example.com/...)
    if (mainImage.startsWith("http")) {
      return mainImage;
    }

    // 3. Handle Local Backend Uploads
    // Windows paths come as "uploads\\file.png", we need "uploads/file.png"
    const cleanPath = mainImage.replace(/\\/g, "/");

    // Prepend your backend URL (Hardcoded for dev, use env variable in prod)
    return `http://localhost:5000/${cleanPath}`;
  };

  // Helper for Price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper for Status Text
  const formatStatus = (status: string) => {
    return (
      status
        ?.split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Status"
    );
  };

  return (
    <div className="group surface-card subtle-ring hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* --- Image Section --- */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <Link href={`/properties/${property._id}`}>
          <div className="relative h-full w-full">
            {/* We use standard <img> because Next/Image is strict about domains */}
            <img
              src={getImageUrl(property.images)}
              alt={property.title || "Property Image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // Fallback if the specific image link breaks
                e.currentTarget.src = "/images.png";
              }}
            />
          </div>
        </Link>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={`${property.status === "for_sale" ? "bg-blue-600" : "bg-emerald-600"} text-white shadow-sm`}>
            {formatStatus(property.status)}
          </Badge>
          <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-slate-800 border border-white/80">
            {formatStatus(property.type)}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(property._id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-lg font-bold text-slate-900 shadow-sm">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-5 flex flex-col grow">
        <div className="mb-4">
          <Link href={`/properties/${property._id}`}>
            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin className="w-4 h-4 mr-1 shrink" />
            <span className="truncate">
              {property.address?.city}, {property.address?.state}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs font-medium text-slate-600">
              {(property.averageRating || 0).toFixed(1)} ({property.numReviews || 0} reviews)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 mb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-slate-900 font-semibold">
              <Bed className="w-4 h-4 text-blue-500" /> {property.bedrooms}
            </div>
            <span className="text-xs text-slate-500">Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-r border-slate-100">
            <div className="flex items-center gap-1 text-slate-900 font-semibold">
              <Bath className="w-4 h-4 text-blue-500" /> {property.bathrooms}
            </div>
            <span className="text-xs text-slate-500">Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-slate-900 font-semibold">
              <Square className="w-4 h-4 text-blue-500" /> {property.area}
            </div>
            <span className="text-xs text-slate-500">Sq Ft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Added{" "}
            {property.createdAt
              ? new Date(property.createdAt).toLocaleDateString()
              : "Unknown"}
          </span>
          <Link href={`/properties/${property._id}`}>
            <Button variant="outline" size="sm" className="border-slate-300 hover:bg-blue-50">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
