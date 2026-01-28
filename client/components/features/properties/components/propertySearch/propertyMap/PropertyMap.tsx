"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { Property } from "@/components/features/properties/types/property";

// --- FIX: Default Leaflet Icons in Next.js ---
// Without this, the map markers will appear broken/invisible
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  // Default center (Colombo coordinates)
  const defaultCenter: [number, number] = [7.5765, 79.7957];

  // If we have properties, try to center on the first one
  const center =
    properties.length > 0 && properties[0].location?.coordinates
      ? ([
          properties[0].location.coordinates[1],
          properties[0].location.coordinates[0],
        ] as [number, number])
      : defaultCenter;

  return (
    <div className="h-125 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property) => {
          // Verify property has valid location data
          if (
            !property.location?.coordinates ||
            property.location.coordinates.length !== 2
          )
            return null;

          // MongoDB GeoJSON is [lng, lat], Leaflet wants [lat, lng]
          const lat = property.location.coordinates[1];
          const lng = property.location.coordinates[0];

          return (
            <Marker key={property._id} position={[lat, lng]}>
              <Popup>
                <div className="min-w-50">
                  <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {property.address?.city}, {property.address?.state}
                  </p>
                  <p className="font-bold text-blue-600 mb-2">
                    ${property.price.toLocaleString()}
                  </p>
                  <Link
                    href={`/properties/${property._id}`}
                    className="block w-full text-center bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
