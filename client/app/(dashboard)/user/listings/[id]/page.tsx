"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { propertyApi } from "@/lib/api/properties";
import { Property } from "@/components/features/properties/types/property";
import { useAuthStore } from "@/stores/auth.store"; // To check ownership
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, MapPin, Bed, Bath, Square, Heart, Share2, 
  ChevronLeft, ChevronRight, Maximize2, CheckCircle2, 
  Calendar, User, Phone, Mail, Clock, Edit, Trash2, ArrowLeft
} from "lucide-react";

// --- HELPER FUNCTIONS ---
const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder-house.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const formatPrice = (price: number, status: string) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Change to 'LKR' or 'Rs' as needed
    maximumFractionDigits: 0,
  }).format(price);
  return status.includes("rent") ? `${formatted}/mo` : formatted;
};

const formatText = (text?: string) => {
  if (!text) return "";
  return text.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

// --- MAIN COMPONENT ---
interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user } = useAuthStore(); // Get current logged-in user

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: any = await propertyApi.getById(unwrappedParams.id);
        const data = response.data || response;
        
        if (data) {
          setProperty(data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to load property", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) return notFound();

  // --- 2. Prepare Data ---
  const images = property.images?.length ? property.images : ["/placeholder-house.jpg"];
  const agent = property.agent as any; // Cast populated agent
  
  // Check Ownership: Does the logged-in user ID match the property creator/agent ID?
  const isOwner = user?._id === (property.createdBy?._id || property.createdBy) || 
                  user?._id === (agent?._id || agent);

  // --- 3. Handlers ---
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await propertyApi.delete(property._id);
        router.push("/my-ads"); // Redirect back to list
      } catch (error) {
        alert("Failed to delete property");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* HEADER WITH ACTIONS */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            
            {/* Title & Back Button */}
            <div>
              <Link href="/my-ads" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to List
              </Link>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={property.status === "for_sale" ? "default" : "secondary"}>
                  {formatText(property.status)}
                </Badge>
                <Badge variant="outline">{formatText(property.type)}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address?.city}, {property.address?.country}
              </div>
            </div>

            {/* Price & Owner Actions */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price, property.status)}
              </div>
              
              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/properties/${property._id}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* GALLERY */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video md:aspect-[2.35/1] mb-8 group">
          <Image
            src={getImageUrl(images[currentImageIndex])}
            alt={property.title}
            fill
            className="object-cover"
            priority
            unoptimized // Keep this if using localhost uploads
          />
          
          {images.length > 1 && (
            <>
              <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full hover:bg-black/70" onClick={prevImage}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full hover:bg-black/70" onClick={nextImage}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-black/50 text-white rounded-full hover:bg-black/70" onClick={() => setIsFullScreen(true)}>
            <Maximize2 className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length} Photos
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="font-bold block">{property.bedrooms} Beds</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="font-bold block">{property.bathrooms} Baths</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="font-bold block">{property.area} sq ft</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="font-bold block">{property.yearBuilt || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              {property.amenities?.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((item:any, i:any) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> {item}
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500">No amenities listed.</p>}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {isOwner ? "Your Listing Status" : "Contact Agent"}
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {agent?.profileImage ? (
                    <Image src={getImageUrl(agent.profileImage)} alt="Agent" width={56} height={56} className="object-cover h-full w-full" />
                  ) : <User className="h-6 w-6 text-blue-600" />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{isOwner ? "You (Owner)" : agent?.name || "Agent"}</p>
                  <p className="text-sm text-gray-500">{agent?.email}</p>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-3">
                  <Button className="w-full justify-start" size="lg">
                    <Phone className="h-4 w-4 mr-3" /> Call Agent
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Mail className="h-4 w-4 mr-3" /> Send Email
                  </Button>
                </div>
              )}

              {isOwner && (
                <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800 border border-green-200">
                  This is your property. It is currently <strong>{property.status.replace('_', ' ')}</strong>.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
            <Image src={getImageUrl(images[currentImageIndex])} alt="Fullscreen" fill className="object-contain" />
            <Button variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/20" onClick={() => setIsFullScreen(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}