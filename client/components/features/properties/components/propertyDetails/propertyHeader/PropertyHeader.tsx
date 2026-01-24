"use client";

import { Property } from "@/components/features/properties/types/property";
import { Heart, Share2, MapPin, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePropertyStore } from "@/stores/property.store";

interface PropertyHeaderProps {
  property: Property;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const { favorites, toggleFavorite } = usePropertyStore();
  const isFavorite = favorites.includes(property._id);

  // Safe formatter for Status/Type strings
  const formatText = (text?: string) => {
    if (!text) return "";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Safe formatter for Price
  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price || 0); // Handle undefined price

    if (property.status === "for_rent" || property.status === "rented") {
      return `${formatted}/month`;
    }
    return formatted;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container px-4 mx-auto py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Property Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant={
                  property.status === "for_sale" ? "default" : "secondary"
                }
              >
                {formatText(property.status)}
              </Badge>
              <Badge variant="outline">{formatText(property.type)}</Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {/* 🛡️ FIX: Added optional chaining (?.) and fallback */}
                <span>
                  {property.address?.city || "Unknown City"},{" "}
                  {property.address?.state || ""}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms || 0} Beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms || 0} Baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{property.area?.toLocaleString() || 0} sq ft</span>
                </div>
              </div>
            </div>

            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleFavorite(property._id)}
              className="flex items-center gap-2"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>

            <Button size="lg" className="px-8">
              Contact Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
