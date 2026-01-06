"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/components/features/properties/types/property";

interface PropertyGalleryProps {
  property: Property;
}

export default function PropertyGallery({ property }: PropertyGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ Robust Image Helper
  const getImageUrl = (path?: string) => {
    if (!path) return "/images.png";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    const cleanPath = path.replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath}`;
  };

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["/images.png"];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100">
      {/* Main Image Stage */}
      <div className="relative aspect-video md:aspect-21/9 group">
        <Image
          src={getImageUrl(images[currentImage])}
          alt={`Property image ${currentImage + 1}`}
          fill
          className="object-cover"
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 80vw"
          onError={(e) => {
            e.currentTarget.src = "/images.png";
          }}
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>

        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-4 bg-white overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
            <Image
              src={getImageUrl(images[currentImage])}
              alt="Fullscreen view"
              fill
              className="object-contain"
            />
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
            >
              Close
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-10 w-10" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-10 w-10" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
