"use client";

import { useEffect, useState } from "react";
import { realEstateApi } from "@/lib/api/realEstate";

export default function SearchMapPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await realEstateApi.getGeoRecommendations(
            position.coords.latitude,
            position.coords.longitude
          );
          setProperties(data);
        } catch (err: any) {
          setError(err?.message || "Failed to load geo recommendations");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied. Enable location to see nearby listings.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Map Search</h1>
        {loading ? (
          <p className="text-sm text-gray-600">Loading nearby recommendations...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">
              Nearby recommendations based on your location:
            </p>
            {properties.map((property) => (
              <div key={property._id} className="rounded border p-3">
                <p className="font-semibold text-gray-900">{property.title}</p>
                <p className="text-sm text-gray-600">
                  {property.address?.city}, {property.address?.state}
                </p>
              </div>
            ))}
            {!properties.length && (
              <p className="text-sm text-gray-500">No nearby listings found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
