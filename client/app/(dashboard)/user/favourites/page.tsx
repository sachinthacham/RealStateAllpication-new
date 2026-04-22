"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Phone } from "lucide-react";
import { propertyApi } from "@/lib/api/properties";
import { Property } from "@/components/features/properties/types/property";
import { Button } from "@/components/ui/button";

const getImageUrl = (images?: string[]) => {
  if (!images || !images.length || !images[0]) return "/images.png";
  const image = images[0];
  if (image.startsWith("http")) return image;
  return `http://localhost:5000/${image.replace(/\\/g, "/")}`;
};

const formatPrice = (price: number, status: Property["status"]) => {
  const formatted = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price);
  return status === "for_rent" ? `${formatted}/month` : formatted;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await propertyApi.getFavorites();
      const data = response.data?.data || [];
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load favourites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (propertyId: string) => {
    try {
      await propertyApi.toggleFavorite(propertyId);
      setFavorites((prev) => prev.filter((property) => property._id !== propertyId));
    } catch (err: any) {
      setError(err?.message || "Failed to remove favourite");
    }
  };

  const stats = useMemo(() => {
    const total = favorites.length;
    const forSale = favorites.filter((item) => item.status === "for_sale").length;
    const forRent = favorites.filter((item) => item.status === "for_rent").length;
    const avgPrice = total
      ? Math.round(favorites.reduce((acc, item) => acc + item.price, 0) / total)
      : 0;
    return { total, forSale, forRent, avgPrice };
  }, [favorites]);

  return (
    <div className="surface-card subtle-ring p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Favourite Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          <div className="text-sm text-blue-600">Total Favourites</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-emerald-700">{stats.forSale}</div>
          <div className="text-sm text-emerald-600">For Sale</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-amber-700">{stats.forRent}</div>
          <div className="text-sm text-amber-600">For Rent</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">
            {stats.avgPrice
              ? new Intl.NumberFormat("en-LK", {
                  style: "currency",
                  currency: "LKR",
                  maximumFractionDigits: 0,
                }).format(stats.avgPrice)
              : "LKR 0"}
          </div>
          <div className="text-sm text-purple-600">Avg Price</div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-slate-500">Loading favourite properties...</div>
      ) : favorites.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-sm text-slate-500">
          You have no favourite properties yet. Browse listings and save what you like.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <Link href={`/properties/${item._id}`} className="block h-52 bg-slate-100">
                <img
                  src={getImageUrl(item.images)}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images.png";
                  }}
                />
              </Link>

              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-blue-700">
                    {formatPrice(item.price, item.status)}
                  </span>
                  <span className="text-xs text-slate-500 uppercase">{item.type}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {item.address?.city}, {item.address?.state}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/properties/${item._id}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4 mr-2" />
                      View Property
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => removeFavorite(item._id)}
                    className="px-3 border-red-200 hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}