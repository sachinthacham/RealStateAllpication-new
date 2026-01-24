import { Property } from "@/components/features/properties/types/property";
import PropertyContact from "../propertyContact/PropertyContact"; // Re-using the contact form here

interface PropertySidebarProps {
  property: Property;
}

export default function PropertySidebar({ property }: PropertySidebarProps) {
  return (
    <div className="space-y-8">
      {/* Sticky wrapper if you want it to scroll with the page */}
      <div className="sticky top-24">
        {/* Price Card (Mobile friendly summary) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 lg:hidden">
          <div className="text-gray-500 text-sm mb-1">Price</div>
          <div className="text-3xl font-bold text-primary">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(property.price)}
            {property.status === "for_rent" && (
              <span className="text-base font-normal text-gray-500">/mo</span>
            )}
          </div>
        </div>

        {/* The Contact Form */}
        <PropertyContact property={property} />

        {/* Safety Tips (Optional filler) */}
        <div className="bg-blue-50 p-4 rounded-xl mt-6">
          <h4 className="font-semibold text-blue-900 mb-2">Safety Tips</h4>
          <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
            <li>Never transfer funds before viewing.</li>
            <li>Check all documents carefully.</li>
            <li>Meet in a safe public place.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
